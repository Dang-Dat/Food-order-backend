import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from 'src/restaurant/entities/restaurant.entity';
import { Request } from 'express';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Restaurant.name) private restaurantModel: SoftDeleteModel<RestaurantDocument>,
  ) { }
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async findAll(userId: string) {
    const restaurant = await this.restaurantModel.findOne({ user: userId })
    if (!restaurant) {
      throw new NotFoundException("khong tim thay")
    }
    const order = await this.orderModel.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");
    return order;
  }

  async findOrdersByUserId(user: IUser) {
    const order = await this.orderModel.findOne({ user: user._id })
      .populate("restaurant")
      .populate("user")
    if (!order) {
      throw new NotFoundException("khong tim thay don hang")
    }
    return order
  }

  async update(orderId: string, updateOrderDto: UpdateOrderDto, userId: string) {
    const order = await this.orderModel.findById(orderId)
    if (!order) {
      throw new NotFoundException('Khong tim thay don hang')
    }
    const restaurant = await this.restaurantModel.findById(order.restaurant);
    if (!restaurant || restaurant.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    return await this.orderModel.updateOne(
      { _id: orderId }, {
      status: updateOrderDto.status
    })
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
