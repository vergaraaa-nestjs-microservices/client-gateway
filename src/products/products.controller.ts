import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { NATS_SERVICE } from 'src/config/services';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.client.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((error) => {
        if (typeof error === 'object') {
          throw new RpcException(error as object);
        }

        throw new RpcException('Unknown error');
      }),
    );

    // try {
    //   const product = await firstValueFrom<{
    //     id: number;
    //     name: string;
    //     price: number;
    //     available: boolean;
    //     createdAt: string;
    //     updatedAt: string;
    //   }>(this.client.send({ cmd: 'find_one_product' }, { id }));

    //   return product;
    // } catch (error) {
    //   if (typeof error === 'object') {
    //     throw new RpcException(error as object);
    //   }
    // }
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.client
      .send(
        { cmd: 'update_product' },
        {
          id,
          ...updateProductDto,
        },
      )
      .pipe(
        catchError((error) => {
          if (typeof error === 'object') {
            throw new RpcException(error as object);
          }

          throw new RpcException('Unknown error');
        }),
      );
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((error) => {
        if (typeof error === 'object') {
          throw new RpcException(error as object);
        }

        throw new RpcException('Unknown error');
      }),
    );
  }
}
