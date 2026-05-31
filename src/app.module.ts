import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './Categories/categorie.module';

import { Product } from './products/entities/product.entity';
import { Categorie } from './Categories/entities/categorie.entity';


import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TimingMiddleware } from './common/middlewares/timing.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    CategoriesModule,
    ConfigModule.forRoot({isGlobal: true,}),
    TypeOrmModule.forRoot(
      (() => {
        switch (process.env.DB_SOURCE) {
  
          case 'sqlite':
            return {
              type: 'sqlite',
              database: 'db.sqlite',
              entities: [Product, Categorie],
              synchronize: true,
            }; 
    
          case 'postgres':
            return {
              type: 'postgres',
              host: 'localhost',
              port: 5432,
              username: 'postgres',
              password: '21334',
              database: 'trabajo_desarrollo',
              entities: [Product, Categorie],
              synchronize: true,
            };
    
          case 'mysql':
            return {
              type: 'mysql',
              host: 'localhost',
              port: 3306,
              username: 'root',
              password: '',
              database: 'mi_db',
              entities: [Product, Categorie],
              synchronize: true,
            };
    
          default:
            throw new Error(
              `DB_SOURCE inválido: ${process.env.DB_SOURCE}`,
            );
        }
    
      })()
    ),
    
  ],
  controllers: [AppController],
  providers: [AppService],
  
})

 // Confifuracion de middlewares
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, TimingMiddleware).forRoutes('*');
  }
}
