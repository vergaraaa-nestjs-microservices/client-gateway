import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config/services';
import { catchError } from 'rxjs';
import { OrdersPaginationDto } from './dto/orders-pagination.dto';

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
  findAll(@Query() ordersPaginationDto: OrdersPaginationDto) {
    return this.productsClient.send('findAllOrders', ordersPaginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsClient.send('findOneOrder', id).pipe(
      catchError((error) => {
        if (typeof error === 'object') {
          throw new RpcException(error as object);
        }

        throw new RpcException('Unknown error');
      }),
    );
  }
}
