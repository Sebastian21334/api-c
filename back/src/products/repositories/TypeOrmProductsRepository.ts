import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import {FindAllFilteredParams, ProductsRepository,} from './products.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class TypeOrmProductsRepository implements ProductsRepository{
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.repository.find({relations: { category: true }, }); 
  }

  async findById(id: number): Promise<Product | undefined> {
    const product = await this.repository.findOne({
      where: { id },
      relations: { category: true }, 
    });
    return product ?? undefined;
  }

  async create(input: CreateProductDto): Promise<Product> {
    const product = this.repository.create({...input, category: { id: input.categorie }, });  
    return await this.repository.save(product);
  }

  async update(id: number, input: UpdateProductDto,): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;
    Object.assign(product, {...input, ...(input.categorie !== undefined && {category: { id: input.categorie },}),}); 
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
      .leftJoinAndSelect('product.category', 'category')  
      .where('LOWER(product.name) = LOWER(:name)', { name })
      .getMany();
  }

  async updateStock(id: number,newStock: number,): Promise<Product> {
    await this.repository.update(id, {stock: newStock,});
    return (await this.findById(id))!;
  }

  async findAllOrdered(orderBy: 'name' | 'price' = 'name', order: 'asc' | 'desc' = 'asc'): Promise<Product[]> {
    return await this.repository.find({
      relations: { category: true },  
      order: {
        [orderBy]: order.toUpperCase() as 'ASC' | 'DESC',
      },
    });
  }

  async findByCategory(categorie: number): Promise<Product[]> {
    return await this.repository.find({
      where: { category: { id: categorie } }, 
      relations: { category: true }, 
    });
}

  async findAllPaginated(skip: number, limit: number,): Promise<[Product[], number]> {
    return this.repository.findAndCount({
      skip,
      take: limit,
      relations: ['categorie'],
    });
  }

  async findAllFiltered(params: FindAllFilteredParams): Promise<[Product[], number]> {
    const { name, sortBy, order = 'ASC', skip, limit } = params;

    const qb = this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category') 
      .skip(skip)
      .take(limit);

    if (name) {
      qb.andWhere('LOWER(product.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }

    if (sortBy) {
      qb.orderBy(`product.${sortBy}`, order);
    }

    return qb.getManyAndCount();
  }
}