/**
 * Excepciones específicas del dominio para repositorios
 * 
 * Separamos las excepciones de dominio de las excepciones técnicas.
 */

export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'DomainException';
  }
}

// Excepciones específicas para repositorios
export class RepositoryException extends DomainException {
  constructor(
    message: string,
    code: string = 'REPOSITORY_ERROR',
    metadata?: Record<string, any>
  ) {
    super(message, code, metadata);
    this.name = 'RepositoryException';
  }
}

export class EntityNotFoundException extends RepositoryException {
  constructor(
    entityName: string,
    id?: string,
    metadata?: Record<string, any>
  ) {
    const message = id 
      ? `${entityName} with ID ${id} not found`
      : `${entityName} not found`;
    
    super(message, 'ENTITY_NOT_FOUND', { entityName, id, ...metadata });
    this.name = 'EntityNotFoundException';
  }
}

export class DuplicateEntityException extends RepositoryException {
  constructor(
    entityName: string,
    field: string,
    value: string,
    metadata?: Record<string, any>
  ) {
    const message = `${entityName} with ${field} '${value}' already exists`;
    
    super(message, 'DUPLICATE_ENTITY', { 
      entityName, 
      field, 
      value, 
      ...metadata 
    });
    this.name = 'DuplicateEntityException';
  }
}

export class InvalidDataException extends RepositoryException {
  constructor(
    message: string,
    field?: string,
    metadata?: Record<string, any>
  ) {
    super(message, 'INVALID_DATA', { field, ...metadata });
    this.name = 'InvalidDataException';
  }
}

export class ConcurrencyException extends RepositoryException {
  constructor(
    entityName: string,
    id: string,
    metadata?: Record<string, any>
  ) {
    const message = `${entityName} with ID ${id} was modified by another transaction`;
    
    super(message, 'CONCURRENCY_ERROR', { entityName, id, ...metadata });
    this.name = 'ConcurrencyException';
  }
}

// Helper para crear excepciones específicas
export const ProductExceptions = {
  notFound: (id?: string) => new EntityNotFoundException('Product', id),
  duplicateSku: (sku: string) => new DuplicateEntityException('Product', 'sku', sku),
  insufficientStock: (productId: string, requested: number, available: number) => 
    new RepositoryException(
      `Insufficient stock for product ${productId}. Requested: ${requested}, Available: ${available}`,
      'INSUFFICIENT_STOCK',
      { productId, requested, available }
    ),
};
