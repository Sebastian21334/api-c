import { IsString, MinLength } from 'class-validator';

export class CreateCategorieDto {
  @IsString()
  @MinLength(2)
  name!: string;
}