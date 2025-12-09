// src/application/usecases/get-all-products.usecase.ts
import { 
  IProductRepository, 
  FindProductsOptions,
  PaginatedProducts 
} from '../../domain/repositories/product-repository.interface';

// QUITA @Injectable() - Lo estamos creando manualmente en el módulo
export class GetAllProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(options?: FindProductsOptions): Promise<PaginatedProducts> {
    return this.productRepository.findAll(options);
  }
}