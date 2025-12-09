// src/infrastructure/product.module.ts
import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { PrismaService } from './database/prisma.service';
import { PrismaProductRepository } from './database/repositories/prisma-product.repository';
import { GetProductByIdUseCase } from '../application/usecases/get-product-by-id.usecase';
import { GetAllProductsUseCase } from '../application/usecases/get-all-products.usecase';
import { PRODUCT_REPOSITORY } from './common/tokens/product.tokens';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    // Servicios de infraestructura
    PrismaService,

    // Repositorio concreto
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },

    // Casos de uso - ¡AHORA CON FACTORY FUNCTIONS!
    {
      provide: GetAllProductsUseCase,
      useFactory: (productRepository: PrismaProductRepository) => {
        return new GetAllProductsUseCase(productRepository);
      },
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: GetProductByIdUseCase,
      useFactory: (productRepository: PrismaProductRepository) => {
        return new GetProductByIdUseCase(productRepository);
      },
      inject: [PRODUCT_REPOSITORY],
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductModule {}