/**
 * DTO SIMPLE para empezar
 * Esto es solo para mover datos, sin lógica
 */

// DTO para enviar producto al frontend
export class SimpleProductResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly currency: string,
    public readonly stock: number,
  ) {}
}

// DTO para recibir datos del frontend  
export class CreateProductRequest {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number,
  ) {}
}
