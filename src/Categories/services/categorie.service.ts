import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    CreateCategorieInput,
    Categorie,
    UpdateCategorieInput,
} from '../categorie.types';
import { CategorieRepository, CATEGORIES_REPOSITORY } from '../repositories/categories.repository';
import { Product } from 'src/products/product.types';
import { ProductsService } from 'src/products/services/products.service';
import { PaginatedResult } from 'src/common/types/paginated-result.type';


@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategorieRepository,

    @Inject(ProductsService)
    private readonly productsService: ProductsService,
  ) {}

  async findOne(id: number): Promise<Categorie> {
    const categorie = await this.categoriesRepository.findById(id);
    if (!categorie) throw new NotFoundException('Categoria no encontrada');
    return categorie;
  }

  async create(input: CreateCategorieInput): Promise<Categorie> {
    const existing = await this.categoriesRepository.findByName(input.name);
    if (existing) throw new ConflictException('La categoría ya existe');
    return this.categoriesRepository.create(input);
  }

  async delete(id: number): Promise<Categorie> {
    const categorie = await this.categoriesRepository.delete(id);
    if (!categorie) throw new NotFoundException('Categoria no encontrada');
    return categorie;
  }

  async findAll(page: number, limit: number,): Promise<PaginatedResult<Categorie>> {
    const skip = (page - 1) * limit;
    const [categories, total] =
      await this.categoriesRepository.findAllPaginated(
        skip,
        limit,
      );
    return {
      data: categories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        },
    };
  } 

  async findByCategory(id: number): Promise<Product[]> {
    const categorie = await this.categoriesRepository.findById(id);
    if (!categorie) throw new NotFoundException(`Categoría con id ${id} no existe`);
    return this.productsService.findByCategory(id);
  }
}