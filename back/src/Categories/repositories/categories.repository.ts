import { CreateCategorieInput, Categorie, UpdateCategorieInput } from '../categorie.types';

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategorieRepository {
  findAll(): Promise<Categorie[]>;
  findById(id: number): Promise<Categorie | undefined>;
  create(input: CreateCategorieInput): Promise<Categorie>;
  update(id: number, input: UpdateCategorieInput): Promise<Categorie>;
  findByName(name: string): Promise<Categorie | undefined>;
  delete(id: number): Promise<Categorie | undefined>;
  findAllPaginated(skip: number, limit: number): Promise<[Categorie[], number]>;
}