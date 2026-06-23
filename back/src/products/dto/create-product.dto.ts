import {IsString,IsNumber,IsPositive,IsInt,Min,MinLength,MaxLength,} from 'class-validator';

export class CreateProductDto {

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsInt()
  categoryId!: number;
}