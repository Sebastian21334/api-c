import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        switch (cfg.get<string>('DB_SOURCE')) {
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
              host: cfg.getOrThrow<string>('DB_HOST'),
              port: cfg.get<number>('DB_PORT') ?? 5432,
              username: cfg.getOrThrow<string>('DB_USERNAME'),
              password: cfg.getOrThrow<string>('DB_PASSWORD'),
              database: cfg.getOrThrow<string>('DB_NAME'),
              entities: [Product, Categorie, UserEntity],
              synchronize: true,
              extra: { decimalNumbers: true },
            };

          default:
            throw new Error(`DB_SOURCE inválido: ${cfg.get('DB_SOURCE')}`);
        }
      },
    }),
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