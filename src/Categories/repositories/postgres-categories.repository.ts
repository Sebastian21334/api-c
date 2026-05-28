import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categorie } from '../entities/categorie.entity';
import { CategorieRepository } from './categories.repository';
import { CreateCategorieInput } from '../categorie.types';

@Injectable()
export class PostgresCategoriesRepository implements CategorieRepository {
  constructor(
    @InjectRepository(Categorie)
    private repository: Repository<Categorie>,
  ) {}

  async findAll(): Promise<Categorie[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Categorie | undefined> {
    return (await this.repository.findOneBy({ id })) ?? undefined;
  }

  async create(input: CreateCategorieInput): Promise<Categorie> {
    const categorie = this.repository.create(input);
    return this.repository.save(categorie);
  }

  async findByName(name: string): Promise<Categorie | undefined> {
    return (await this.repository.findOneBy({ name })) ?? undefined;
  }

  async delete(id: number): Promise<Categorie | undefined> {
    const categorie = await this.findById(id);
    if (!categorie) return undefined;
    await this.repository.delete(id);
    return categorie;
  }

  async findAllPaginated(
    skip: number,
    limit: number,
  ): Promise<[Categorie[], number]> {
    return this.repository.findAndCount({
      skip,
      take: limit,
    });
  }
}