import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categorie } from '../../Categories/entities/categorie.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('decimal')
  price!: number;

  @Column()
  stock!: number;

  @ManyToOne(() => Categorie, (c) => c.products)
  @JoinColumn({ name: 'categorie_id' })
  category!: Categorie;  
}