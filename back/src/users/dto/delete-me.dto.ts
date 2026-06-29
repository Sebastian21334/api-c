import { IsString } from 'class-validator';

export class DeleteMeDto {
  @IsString()
  password!: string;
}