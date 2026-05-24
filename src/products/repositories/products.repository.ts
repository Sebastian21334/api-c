import {
  CreateProductInput,
  UpdateProductInput,
} from '../product.types';

import { Product } from '../entities/product.entity';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsRepository {
  findAll(): Promise<Product[]>;
  findById(id: number, ): Promise<Product | undefined>;
  create( input: CreateProductInput,): Promise<Product>;
  update(id: number, input: UpdateProductInput, ): Promise<Product | undefined>;
  remove(id: number, ): Promise<Product | undefined>;
  findByName(name: string, ): Promise<Product[]>;
  updateStock(id: number, newStock: number, ): Promise<Product>;
  findAllOrdered( orderBy?: 'name' | 'price', order?: 'asc' | 'desc', ): Promise<Product[]>;
  findByCategory(categorie: number, ): Promise<Product[]>;
}