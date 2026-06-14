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
import { CategoriesService } from '../services/categorie.service';
import {Categorie,} from '../categorie.types';
import { Product } from 'src/products/product.types';
import { PaginatedResult } from 'src/common/types/paginated-result.type';
import { CreateCategorieDto } from '../dto/create-categorie.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginatedResult<Categorie>> {

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;
    if (limit > 50) limit = 50;
    if (limit < 1) limit = 10;

    return this.categoriesService.findAll(
      page,
      limit,
    );
  }

  @Get(':id/products')
  async findByCategorie(@Param('id') id: string): Promise<Product[]> {
    return this.categoriesService.findByCategory(Number(id));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Categorie> {
    return this.categoriesService.findOne(Number(id));
  }

  @Post()
  async create(@Body() body: CreateCategorieDto): Promise<Categorie> {
  return this.categoriesService.create(body);
}

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<Categorie | undefined> {
    return this.categoriesService.delete(Number(id));
  }
}