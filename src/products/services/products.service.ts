import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {CreateProductInput,UpdateProductInput,} from '../product.types';
import { Product } from '../entities/product.entity';
import {PRODUCTS_REPOSITORY,ProductsRepository,} from '../repositories/products.repository';
import { CategorieRepository, CATEGORIES_REPOSITORY } from 'src/Categories/repositories/categories.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,

    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategorieRepository,
  ) {}

  async findByName(name: string): Promise<Product[]> {
    return this.productsRepository.findByName(name);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.findAll();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const encontrados = await this.productsRepository.findByName(input.name);
    const categorie = await this.categoriesRepository.findById(input.categorie);

    if (!categorie) {
      throw new NotFoundException(`La categoría con id ${input.categorie} no existe`);
    }

    if (encontrados.length > 0) {
      const productoExistente = encontrados[0];
      const nuevoStock = productoExistente.stock + input.stock;
      const actualizado = await this.productsRepository.update(productoExistente.id, {
        stock: nuevoStock,
        price: input.price,
      },
    );
      if (!actualizado) {
        throw new NotFoundException('No se pudo actualizar el producto existente');
      }
      return actualizado;
    }
    return this.productsRepository.create(input);
  }


  async update(id: number, input: UpdateProductInput): Promise<Product> {
    const product = await this.productsRepository.update(id, input);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.productsRepository.remove(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async reduceStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product no encontrado');
    if (quantity > product.stock) {
      throw new BadRequestException('Stock insuficiente');
    }
    return this.productsRepository.updateStock(id, product.stock - quantity);
  }

  async findAllOrdered(
    orderBy?: 'name' | 'price',
    order: 'asc' | 'desc' = 'asc',
  ): Promise<Product[]> {
    return this.productsRepository.findAllOrdered(orderBy, order);
  }

  async findByCategory(categorie: number): Promise<Product[]> {
    return this.productsRepository.findByCategory(categorie);
  }
}
