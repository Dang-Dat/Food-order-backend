import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/order/entities/order.entity';
import { Restaurant, RestaurantDocument } from 'src/restaurant/entities/restaurant.entity';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CheckoutSessionRequest } from './dto/create-stripe.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Restaurant.name) private restaurantModel: SoftDeleteModel<RestaurantDocument>,
    private readonly stripe: Stripe,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_WEBHOOK_SECRET'), {
      apiVersion: '2024-06-20',
    });
  }

  async handleWebhook(body: any, res: Response, sig: string) {
    // console.log("received enent")
    // console.log("received enent")
    // console.log(" event:", body)
    // return "ok"
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, sig, this.configService.get<string>('STRIPE_WEBHOOK_SECRET'));
    } catch (error) {
      console.log(error);
      return new Error(`Webhook error: ${error.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const order = await this.orderModel.findById(event.data.object.metadata?.orderId);

      if (!order) {
        throw new NotFoundException("ko tim thay")
      }
      await this.orderModel.updateOne({ _id: order._id }, {
        totalAmount: event.data.object.amount_total,
        status: 'paid'
      })
      // order.totalAmount = event.data.object.amount_total;
      // order.status = 'paid';
      // await order.save();
    }

    return "ok"
  }

  async createCheckoutSession(
    checkoutSessionRequest: CheckoutSessionRequest,
    user: any,
  ) {
    try {
      const restaurant = await this.restaurantModel.findById(checkoutSessionRequest.restaurantId);

      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      const newOrder = new this.orderModel({
        restaurant: restaurant,
        user: user._id,
        status: 'placed',
        deliveryDetails: checkoutSessionRequest.deliveryDetails,
        cartItems: checkoutSessionRequest.cartItems,
        createdAt: new Date(),
      });

      const lineItems = this.createLineItems(checkoutSessionRequest, restaurant.menuItems);

      const session = await this.createSession(lineItems, newOrder._id.toString(), restaurant.deliveryPrice, restaurant._id.toString());

      if (!session.url) {
        return new Error('Error creating stripe session');
      }

      await newOrder.save();
      return { url: session.url };
    } catch (error) {
      console.log(error);
      return new Error("{ message: error.message }");
    }
  }

  private createLineItems(
    checkoutSessionRequest: CheckoutSessionRequest,
    menuItems: any[],
  ) {
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
      const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuItemId.toString());

      if (!menuItem) {
        throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
      }

      return {
        price_data: {
          currency: 'gbp',
          unit_amount: menuItem.price,
          product_data: {
            name: menuItem.name,
          },
        },
        quantity: parseInt(cartItem.quantity),
      };
    });

    return lineItems;
  }

  private async createSession(
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    orderId: string,
    deliveryPrice: number,
    restaurantId: string,
  ) {
    const sessionData = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Delivery',
            type: 'fixed_amount',
            fixed_amount: {
              amount: deliveryPrice,
              currency: 'gbp',
            },
          },
        },
      ],
      mode: 'payment',
      metadata: {
        orderId,
        restaurantId,
      },
      success_url: `${this.configService.get<string>('FRONTEND_URL')}/order-status?success=true`,
      cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/detail/${restaurantId}?cancelled=true`,
    });

    return sessionData;
  }


}
