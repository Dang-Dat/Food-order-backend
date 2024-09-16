import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from 'src/restaurant/entities/restaurant.entity';
import { Order, OrderSchema } from './entities/order.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Restaurant.name, schema: RestaurantSchema },
    { name: Order.name, schema: OrderSchema }
  ])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule { }
