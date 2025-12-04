/**
 * Entity: Product
 * 
 * Características:
 * 1. IDENTIDAD: Tiene un ID único que la identifica
 * 2. MUTABLE: Puede cambiar con el tiempo (stock, precio, etc.)
 * 3. COMPORTAMIENTO: Lógica de negocio encapsulada
 * 4. VALIDACIÓN: Reglas de negocio integradas
 */

import { Price } from '../value-objects/price.vo';

// Interface para las propiedades del constructor (TypeScript best practice)
export interface ProductProps {
  id?: string;           // Opcional para nuevas creaciones
  name: string;
  description: string;
  price: Price;          // Usamos nuestro Value Object
  stock: number;
  sku: string;           // Stock Keeping Unit - identificador único de producto
  category: string;
  images?: string[];     // URLs de imágenes
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  // =====================
  // PROPIEDADES PÚBLICAS (solo lectura - identidad)
  // =====================
  public readonly id: string;
  public readonly createdAt: Date;

  // =====================
  // PROPIEDADES PRIVADAS (encapsulamiento)
  // =====================
  private name: string;
  private description: string;
  private price: Price;
  private stock: number;
  private sku: string;
  private category: string;
  private images: string[];
  private isActive: boolean;
  private updatedAt: Date; // Cambiado a private para poder modificar

  // =====================
  // CONSTRUCTOR PRIVADO
  // =====================
  private constructor(props: ProductProps) {
    // VALIDACIONES DE REGLAS DE NEGOCIO
    this.validateProps(props);

    // Generar ID si no viene (nuevo producto)
    this.id = props.id || this.generateId();
    
    // Asignar propiedades
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.stock = props.stock;
    this.sku = props.sku;
    this.category = props.category;
    this.images = props.images || [];
    this.isActive = props.isActive !== undefined ? props.isActive : true;
    
    // Timestamps
    const now = new Date();
    this.createdAt = props.createdAt || now;
    this.updatedAt = props.updatedAt || now;
  }

  // =====================
  // MÉTODOS DE FÁBRICA (FACTORY METHODS)
  // =====================

  /**
   * Para crear un NUEVO producto (sin ID)
   */
  static create(props: Omit<ProductProps, 'id'>): Product {
    return new Product({
      ...props,
      id: undefined, // Se generará automáticamente
    });
  }

  /**
   * Para reconstruir un producto EXISTENTE (con ID desde DB)
   */
  static reconstruct(props: ProductProps): Product {
    return new Product(props);
  }

  // =====================
  // VALIDACIONES
  // =====================

  private validateProps(props: ProductProps): void {
    // 1. Nombre no puede estar vacío
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }

    // 2. Nombre máximo 100 caracteres
    if (props.name.length > 100) {
      throw new Error('Product name cannot exceed 100 characters');
    }

    // 3. Descripción máxima 500 caracteres
    if (props.description.length > 500) {
      throw new Error('Description cannot exceed 500 characters');
    }

    // 4. Stock no puede ser negativo
    if (props.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    // 5. SKU es requerido y debe tener formato válido
    if (!props.sku || props.sku.trim().length === 0) {
      throw new Error('SKU is required');
    }

    // 6. SKU debe tener al menos 3 caracteres
    if (props.sku.length < 3) {
      throw new Error('SKU must be at least 3 characters');
    }

    // 7. Categoría es requerida
    if (!props.category || props.category.trim().length === 0) {
      throw new Error('Category is required');
    }

    // 8. Precio debe ser instancia válida de Price
    if (!(props.price instanceof Price)) {
      throw new Error('Price must be a valid Price value object');
    }
  }

  // =====================
  // COMPORTAMIENTO (BUSINESS LOGIC)
  // =====================

  /**
   * Reducir stock al vender
   */
  reduceStock(quantity: number): void {
    this.validateActiveProduct('reduce stock');
    
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    if (this.stock < quantity) {
      throw new Error(`Insufficient stock. Available: ${this.stock}, Requested: ${quantity}`);
    }

    this.stock -= quantity;
    this.updateTimestamp();
  }

  /**
   * Aumentar stock (reabastecimiento)
   */
  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    this.stock += quantity;
    this.updateTimestamp();
  }

  /**
   * Actualizar precio
   */
  updatePrice(newPrice: Price): void {
    this.validateActiveProduct('update price');
    
    this.price = newPrice;
    this.updateTimestamp();
  }

  /**
   * Actualizar información básica
   */
  updateInfo(name: string, description: string, category: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    if (name.length > 100) {
      throw new Error('Name cannot exceed 100 characters');
    }

    this.name = name;
    this.description = description;
    this.category = category;
    this.updateTimestamp();
  }

  /**
   * Agregar imágenes
   */
  addImages(imageUrls: string[]): void {
    const validUrls = imageUrls.filter(url => 
      url && url.trim().length > 0 && this.isValidImageUrl(url)
    );
    
    this.images = [...this.images, ...validUrls];
    this.updateTimestamp();
  }

  /**
   * Remover imágenes
   */
  removeImage(imageUrl: string): void {
    this.images = this.images.filter(img => img !== imageUrl);
    this.updateTimestamp();
  }

  /**
   * Activar producto
   */
  activate(): void {
    this.isActive = true;
    this.updateTimestamp();
  }

  /**
   * Desactivar producto
   */
  deactivate(): void {
    this.isActive = false;
    this.updateTimestamp();
  }

  // =====================
  // GETTERS (ACCESO CONTROLADO)
  // =====================

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): Price {
    return this.price;
  }

  getStock(): number {
    return this.stock;
  }

  getSku(): string {
    return this.sku;
  }

  getCategory(): string {
    return this.category;
  }

  getImages(): string[] {
    return [...this.images]; // Devolver copia para inmutabilidad
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getUpdatedAt(): Date {
    return new Date(this.updatedAt); // Devolver copia para inmutabilidad
  }

  // =====================
  // QUERIES (CONSULTAS)
  // =====================

  /**
   * Verificar si hay stock disponible
   */
  hasStock(): boolean {
    return this.stock > 0;
  }

  /**
   * Verificar si tiene stock mínimo
   */
  hasMinimumStock(minimum: number = 5): boolean {
    return this.stock >= minimum;
  }

  /**
   * Verificar si está por debajo del stock mínimo
   */
  isLowStock(minimum: number = 5): boolean {
    return this.stock > 0 && this.stock < minimum;
  }

  /**
   * Verificar si está agotado
   */
  isOutOfStock(): boolean {
    return this.stock === 0;
  }

  /**
   * Calcular valor total del inventario
   */
  getInventoryValue(): Price {
    return this.price.multiply(this.stock);
  }

  // =====================
  // VALIDACIONES INTERNAS
  // =====================

  private validateActiveProduct(action: string): void {
    if (!this.isActive) {
      throw new Error(`Cannot ${action} for inactive product`);
    }
  }

  private isValidImageUrl(url: string): boolean {
    // Validación básica de URL de imagen
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  }

  // =====================
  // MÉTODOS PRIVADOS
  // =====================

  private generateId(): string {
    // En producción usaríamos UUID
    // Por ahora: timestamp + random
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `prod_${timestamp}_${random}`;
  }

  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  // =====================
  // SERIALIZACIÓN
  // =====================

  /**
   * Para API responses
   */
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price.toPrimitives(),
      stock: this.stock,
      sku: this.sku,
      category: this.category,
      images: this.images,
      isActive: this.isActive,
      hasStock: this.hasStock(),
      isLowStock: this.isLowStock(),
      inventoryValue: this.getInventoryValue().toPrimitives(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Para persistencia en base de datos
   */
  toPrimitives(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price.toPrimitives(),
      stock: this.stock,
      sku: this.sku,
      category: this.category,
      images: this.images,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Para debugging
   */
  toString(): string {
    return `Product "${this.name}" (${this.sku}) - ${this.price.format()} - Stock: ${this.stock}`;
  }
}
