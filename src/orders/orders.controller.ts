import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config/services';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    void createOrderDto;
    return this.productsClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll() {
    return this.productsClient.send('findAllOrders', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsClient.send('findOneOrder', id);
  }
}
