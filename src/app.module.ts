import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './Categories/categorie.module';
import { AuthModule } from './auth/auth.module';

import { Product } from './products/entities/product.entity';
import { Categorie } from './Categories/entities/categorie.entity';
import { UserEntity } from './users/entities/user.entity';

import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TimingMiddleware } from './common/middlewares/timing.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(
      (() => {
        switch (process.env.DB_SOURCE) {
          case 'sqlite':
            return {
              type: 'sqlite',
              database: 'db.sqlite',
              entities: [Product, Categorie, UserEntity],
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
              entities: [Product, Categorie, UserEntity],
              synchronize: true,
            };

          default:
            throw new Error(`DB_SOURCE inválido: ${process.env.DB_SOURCE}`);
        }
      })()
    ),
    ProductsModule,
    UsersModule,
    CategoriesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, TimingMiddleware).forRoutes('*');
  }
}