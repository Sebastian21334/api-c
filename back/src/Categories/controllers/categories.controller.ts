import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categorie.service';
import { Categorie } from '../categorie.types';
import { Product } from 'src/products/product.types';
import { CreateCategorieDto } from '../dto/create-categorie.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user-role.enum';

@Controller('categories')
@UseGuards(JwtAuthGuard)

export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<Categorie[]> {
    return this.categoriesService.findAll();
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
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() body: CreateCategorieDto,
  ): Promise<Categorie> {
    return this.categoriesService.create(body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(
    @Param('id') id: number,
  ): Promise<Categorie | undefined> {
    return this.categoriesService.delete(Number(id));
  }
}