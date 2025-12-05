/**
 * MAPPER SIMPLE
 * Convierte Product (dominio) → SimpleProductResponse (DTO)
 */

import { Product } from '../../domain/entities/product.entity';
import { SimpleProductResponse } from '../dtos/simple-product.dto';

export class SimpleProductMapper {
  /**
   * Convertir Product → SimpleProductResponse
   */
  static toResponse(product: Product): SimpleProductResponse {
    return new SimpleProductResponse(
      product.id,
      product.getName(),
      product.getPrice().getAmount(),
      product.getPrice().getCurrency(),
      product.getStock(),
    );
  }
  
  /**
   * Convertir array de Products → array de Responses
   */
  static toResponseArray(products: Product[]): SimpleProductResponse[] {
    return products.map(product => this.toResponse(product));
  }
}
