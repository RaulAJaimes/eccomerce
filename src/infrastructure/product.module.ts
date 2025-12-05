import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [],
})
export class ProductModule {}
