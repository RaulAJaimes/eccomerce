import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductController {
  @Get()
  getProducts() {
    return {
      success: true,
      message: 'Products endpoint is working!',
      timestamp: new Date().toISOString(),
      data: []
    };
  }
}
