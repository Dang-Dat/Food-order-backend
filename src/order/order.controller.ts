import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorator/customeiz';
import { IUser } from 'src/users/user.interface';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get("getAll")
  findAll(@Body() userId: string) {
    return this.orderService.findAll(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("my/restaurant")
  getMyRestaurantOrders(@User() user: IUser) {
    return this.orderService.fetchAllMyRestaurantOrder(user);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get("my")
  getMyOrder(@User() user: IUser) {
    return this.orderService.fetchAllMyOrder(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @User() user: IUser,
  ) {
    return this.orderService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
