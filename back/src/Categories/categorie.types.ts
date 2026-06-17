export type Categorie = {
    id: number, 
    name: string 
}

export type CreateCategorieInput = {
    name: string
  };

export type UpdateCategorieInput = {
    name?: string;
  };
