/**
 * CASO DE USO SIMPLE: Obtener producto por ID
 * 
 * Responsabilidades:
 * 1. Recibir ID
 * 2. Llamar al repositorio
 * 3. Convertir resultado
 * 4. Devolver respuesta
 */

import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { SimpleProductMapper } from '../mappers/simple-product.mapper';
import { SimpleProductResponse } from '../dtos/simple-product.dto';

export class GetProductByIdUseCase {
  /**
   * Inyectamos el repositorio (INTERFAZ, no implementación)
   */
  constructor(private readonly productRepository: IProductRepository) {}

  /**
   * Ejecutar el caso de uso
   */
  async execute(productId: string): Promise<SimpleProductResponse> {
    console.log(`[UseCase] Buscando producto con ID: ${productId}`);
    
    // 1. Validar que el ID no esté vacío
    if (!productId || productId.trim() === '') {
      throw new Error('Product ID is required');
    }
    
    // 2. Llamar al repositorio (sabe QUÉ hacer, no CÓMO)
    const product = await this.productRepository.findById(productId);
    
    // 3. Si no existe, lanzar error
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    
    // 4. Convertir a DTO usando el mapper
    return SimpleProductMapper.toResponse(product);
  }
}
