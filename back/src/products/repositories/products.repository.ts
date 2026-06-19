import {CreateProductDto,} from '../dto/create-product.dto';
import {UpdateProductDto,} from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';


export interface FindAllFilteredParams {
  name?: string;
  sortBy?: 'id' | 'name' | 'price' | 'stock';
  order?: 'ASC' | 'DESC';
  skip: number;
  limit: number;
}


export interface ProductsRepository {
  findAll(): Promise<Product[]>;
  findById(id: number, ): Promise<Product | undefined>;
  create( input: CreateProductDto,): Promise<Product>;
  update(id: number, input: UpdateProductDto, ): Promise<Product | undefined>;
  remove(id: number, ): Promise<Product | undefined>;
  findByName(name: string, ): Promise<Product[]>;
  updateStock(id: number, newStock: number, ): Promise<Product>;
  findAllOrdered( orderBy?: 'name' | 'price', order?: 'asc' | 'desc', ): Promise<Product[]>;
  findByCategory(categorie: number, ): Promise<Product[]>;
  findAllPaginated(skip: number, limit: number,): Promise<[Product[], number]> ;
  findAllFiltered(params: FindAllFilteredParams): Promise<[Product[], number]>;
}