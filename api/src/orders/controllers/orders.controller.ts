import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto.js';
import type { Order } from '../interfaces/order.interface.js';
import { OrdersService } from '../services/orders.service.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findById(id);
  }
}
