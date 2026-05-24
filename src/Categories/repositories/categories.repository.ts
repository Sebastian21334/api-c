import { CreateCategorieInput, Categorie } from '../categorie.types';

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategorieRepository {
  findAll(): Promise<Categorie[]>;
  findById(id: number): Promise<Categorie | undefined>;
  create(input: CreateCategorieInput): Promise<Categorie>;
  findByName(name: string): Promise<Categorie | undefined>;
  delete(id: number): Promise<Categorie | undefined>;
}