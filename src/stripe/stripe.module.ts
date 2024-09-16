import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { Order, OrderSchema } from 'src/order/entities/order.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from 'src/restaurant/entities/restaurant.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema },
    { name: Restaurant.name, schema: RestaurantSchema },
    
  ]),
  ConfigModule
],
  controllers: [StripeController],
  providers: [
    {
      provide: Stripe,
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get<string>('STRIPE_API_KEY'), {
          apiVersion: '2024-06-20',
        });
      },
      inject: [ConfigService],
    },
    StripeService,
  ],
  
})
export class StripeModule { }
