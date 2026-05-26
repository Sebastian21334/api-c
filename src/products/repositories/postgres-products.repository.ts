import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import {ProductsRepository,} from './products.repository';
import {CreateProductInput,UpdateProductInput,} from '../product.types';

@Injectable()
export class PostgresProductsRepository
  implements ProductsRepository{
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.repository.find({relations: { categorie: true }, });
  
  }
  async findById(id: number): Promise<Product | undefined> {
    const product = await this.repository.findOne({
      where: { id },
      relations: { categorie: true },
    });
    return product ?? undefined;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product = this.repository.create({...input, categorie: { id: input.categorie }, });
    return await this.repository.save(product);
  }

  async update(id: number, input: UpdateProductInput,): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;
    Object.assign(product, {...input, ...(input.categorie !== undefined && {categorie: { id: input.categorie },}),});
    return await this.repository.save(product);
  }

  async remove(id: number,): Promise<Product | undefined> { 
    const product = await this.findById(id);
    if (!product) {return undefined;}
    await this.repository.delete(id);
    return product;
  }

  async findByName(name: string): Promise<Product[]> {
    return await this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categorie', 'categorie')
      .where('LOWER(product.name) = LOWER(:name)', { name })
      .getMany();
    }

  async updateStock(id: number,newStock: number,): Promise<Product> {
    await this.repository.update(id, {stock: newStock,});
    return (await this.findById(id))!;
  }

  async findAllOrdered(orderBy: 'name' | 'price' = 'name', order: 'asc' | 'desc' = 'asc'): Promise<Product[]> {
    return await this.repository.find({
      relations: { categorie: true },
      order: {
        [orderBy]: order.toUpperCase() as 'ASC' | 'DESC',
      },
    });
  }

  async findByCategory(categorie: number): Promise<Product[]> {
    return await this.repository.find({
      where: { categorie: { id: categorie } },
      relations: { categorie: true },
    });
  }
  
}