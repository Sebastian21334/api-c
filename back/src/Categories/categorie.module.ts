import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './controllers/categories.controller';
import { CATEGORIES_REPOSITORY } from './repositories/categories.repository';
import { CategoriesService } from './services/categorie.service';
import { PostgresCategoriesRepository } from './repositories/postgres-categories.repository';
import { Categorie } from './entities/categorie.entity';

@Global()
@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    { provide: CATEGORIES_REPOSITORY, useClass: PostgresCategoriesRepository },
  ],
  exports: [CategoriesService, CATEGORIES_REPOSITORY],
  imports: [TypeOrmModule.forFeature([Categorie])],
})
export class CategoriesModule {}