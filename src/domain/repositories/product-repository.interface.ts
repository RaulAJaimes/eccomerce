/**
 * Puerto: ProductRepository
 * 
 * Define QUÉ debe hacer la persistencia de productos, no CÓMO lo hace.
 * Esta interfaz vive en el DOMINIO (capa más interna).
 * 
 * Principios:
 * 1. El dominio define el contrato
 * 2. La infraestructura implementa el contrato
 * 3. El dominio NUNCA depende de implementaciones concretas
 */

import { Product } from '../entities/product.entity';

// Interface para opciones de búsqueda/paginación
export interface FindProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  searchTerm?: string;
}

// Interface para resultados paginados
export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Puerto principal para operaciones de producto
 */
export interface IProductRepository {
  // =====================
  // OPERACIONES CRUD BÁSICAS
  // =====================
  
  /**
   * Guardar un producto (crear o actualizar)
   */
  save(product: Product): Promise<Product>;
  
  /**
   * Encontrar producto por ID
   */
  findById(id: string): Promise<Product | null>;
  
  /**
   * Encontrar producto por SKU (único)
   */
  findBySku(sku: string): Promise<Product | null>;
  
  /**
   * Eliminar producto por ID
   */
  delete(id: string): Promise<void>;
  
  // =====================
  // OPERACIONES DE BÚSQUEDA
  // =====================
  
  /**
   * Encontrar todos los productos (con opciones)
   */
  findAll(options?: FindProductsOptions): Promise<PaginatedProducts>;
  
  /**
   * Encontrar productos por categoría
   */
  findByCategory(category: string, options?: Omit<FindProductsOptions, 'category'>): Promise<PaginatedProducts>;
  
  /**
   * Encontrar productos con stock bajo
   */
  findLowStock(minimumStock?: number): Promise<Product[]>;
  
  /**
   * Buscar productos por término (nombre, descripción)
   */
  search(term: string, options?: Omit<FindProductsOptions, 'searchTerm'>): Promise<PaginatedProducts>;
  
  // =====================
  // OPERACIONES DE INVENTARIO
  // =====================
  
  /**
   * Actualizar stock de un producto
   */
  updateStock(productId: string, quantity: number): Promise<void>;
  
  /**
   * Verificar disponibilidad de stock
   */
  checkStockAvailability(productId: string, quantity: number): Promise<boolean>;
  
  /**
   * Obtener valor total del inventario
   */
  getTotalInventoryValue(): Promise<number>;
  
  // =====================
  // OPERACIONES POR LOTES
  // =====================
  
  /**
   * Guardar múltiples productos
   */
  saveMany(products: Product[]): Promise<Product[]>;
  
  /**
   * Actualizar múltiples productos
   */
  updateMany(products: Product[]): Promise<Product[]>;
  
  // =====================
  // OPERACIONES DE CONTEO
  // =====================
  
  /**
   * Contar total de productos
   */
  count(): Promise<number>;
  
  /**
   * Contar productos por categoría
   */
  countByCategory(category: string): Promise<number>;
  
  /**
   * Contar productos activos/inactivos
   */
  countByStatus(isActive: boolean): Promise<number>;
  
  // =====================
  // OPERACIONES ESPECIALES
  // =====================
  
  /**
   * Verificar si SKU existe
   */
  skuExists(sku: string, excludeId?: string): Promise<boolean>;
  
  /**
   * Obtener todas las categorías únicas
   */
  getCategories(): Promise<string[]>;
  
  /**
   * Obtener productos más vendidos
   */
  getTopSelling(limit?: number): Promise<Product[]>;
  
  /**
   * Obtener productos recientemente agregados
   */
  getRecentlyAdded(limit?: number): Promise<Product[]>;
}
