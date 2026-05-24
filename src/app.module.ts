import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './Categories/categorie.module';

import { Product } from './products/entities/product.entity';
import { Categorie } from './Categories/entities/categorie.entity';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    CategoriesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '21334',
      database: 'trabajo_desarrollo',
      entities: [Product, Categorie],  
      synchronize: true,               
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}