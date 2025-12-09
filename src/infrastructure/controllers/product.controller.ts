import { Controller, Get, Param } from '@nestjs/common';
import { GetAllProductsUseCase } from '../../application/usecases/get-all-products.usecase';
import { GetProductByIdUseCase } from '../../application/usecases/get-product-by-id.usecase';

@Controller('products')
export class ProductController {
  constructor(
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  @Get()
  async getProducts() {
    try {
      const products = await this.getAllProductsUseCase.execute();
      return {
        success: true,
        message: 'Products retrieved successfully',
        timestamp: new Date().toISOString(),
        data: products,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error retrieving products',
        error: error.message,
        timestamp: new Date().toISOString(),
        data: [],
      };
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    try {
      const product = await this.getProductByIdUseCase.execute(id);
      return {
        success: true,
        message: 'Product retrieved successfully',
        timestamp: new Date().toISOString(),
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error retrieving product',
        error: error.message,
        timestamp: new Date().toISOString(),
        data: null,
      };
    }
  }
}
