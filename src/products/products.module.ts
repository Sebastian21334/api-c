import { Global, Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { PRODUCTS_REPOSITORY } from './repositories/products.repository';
import { ProductsService } from './services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { TypeOrmProductsRepository  } from './repositories/TypeOrmProductsRepository';

@Global()
@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository,}
  ],
  exports: [ProductsService, PRODUCTS_REPOSITORY],
  imports: [
    TypeOrmModule.forFeature([Product])
  ],
})
export class ProductsModule {}
