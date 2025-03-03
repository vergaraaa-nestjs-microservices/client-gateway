import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config/services';
import { catchError } from 'rxjs';
import { OrdersPaginationDto } from './dto/orders-pagination.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StatusDto } from './dto/status.dto';

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

  @Get('/id/:id')
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

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.productsClient
      .send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      })
      .pipe(
        catchError((error) => {
          if (typeof error === 'object') {
            throw new RpcException(error as object);
          }

          throw new RpcException('Unknown error');
        }),
      );
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this.productsClient
      .send('changeOrderStatus', {
        id,
        status: statusDto.status,
      })
      .pipe(
        catchError((error) => {
          if (typeof error === 'object') {
            throw new RpcException(error as object);
          }

          throw new RpcException('Unknown error');
        }),
      );
  }
}
