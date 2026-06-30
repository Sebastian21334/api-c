import { Categorie } from 'src/Categories/entities/categorie.entity';

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: Categorie | null;
};

export type CreateProductInput = {
  name: string;
  price: number;
  stock: number;
  categorie: number;
};

export type UpdateProductInput = {
  name?: string;
  price?: number;
  stock?: number;
  categorie?: number;
};  