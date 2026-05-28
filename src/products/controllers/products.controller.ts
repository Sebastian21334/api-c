import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product,} from '../product.types';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('orderBy') orderBy?: 'name' | 'price',
    @Query('order') order: 'asc' | 'desc' = 'asc',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Product[] | PaginatedResult<Product>> {

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;
    if (limit > 50) limit = 50;
    if (limit < 1) limit = 10;

    if (name) return this.productsService.findByName(name);
    if (orderBy) return this.productsService.findAllOrdered(orderBy, order);
    
    return this.productsService.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(Number(id));
  }

  @Post()
  async create(@Body() body: CreateProductDto): Promise<Product> {
    return this.productsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProductDto): Promise<Product> {
    return this.productsService.update(Number(id), body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(Number(id));
  }

  @Patch(':id/stock')
  async reduceStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productsService.reduceStock(Number(id), quantity);
  }
}