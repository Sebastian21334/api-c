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
  UseGuards,
} from '@nestjs/common';

import { ProductsService } from '../services/products.service';
import { Product } from '../product.types';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user-role.enum';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('sortBy') sortBy?: 'id' | 'name' | 'price' | 'stock',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginatedResult<Product>> {
    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;
    if (limit > 100) limit = 100;
    if (limit < 1) limit = 10;

    return this.productsService.findAll({
      page,
      limit,
      name,
      sortBy,
      order,
    });
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<Product> {
    return this.productsService.findOne(Number(id));
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() body: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(body);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(
      Number(id),
      body,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(
    @Param('id') id: string,
  ): Promise<Product> {
    return this.productsService.remove(Number(id));
  }

  @Patch(':id/stock')
  async reduceStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.reduceStock(
      Number(id),
      quantity,
    );
  }
}