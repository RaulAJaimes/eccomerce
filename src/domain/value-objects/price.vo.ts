/**
 * Value Object: Price
 * 
 * Características:
 * 1. INMUTABLE: Una vez creado no puede cambiar
 * 2. VALIDACIÓN: Reglas de negocio integradas
 * 3. COMPORTAMIENTO: Métodos para operaciones
 * 4. POR VALOR: Dos precios iguales son iguales si tienen mismo valor
 */

export class Price {
  // Propiedades privadas y readonly para inmutabilidad
  private readonly amount: number;
  private readonly currency: string;

  /**
   * Constructor PRIVADO - Solo se crea a través de factory methods
   * Esto garantiza que todas las instancias sean válidas
   */
  private constructor(amount: number, currency: string = 'USD') {
    // VALIDACIONES DE REGLAS DE NEGOCIO
    
    // 1. El precio no puede ser negativo
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }

    // 2. Solo aceptamos ciertas monedas
    const validCurrencies = ['USD', 'EUR', 'COP'];
    if (!validCurrencies.includes(currency)) {
      throw new Error(`Currency ${currency} is not supported. Valid: ${validCurrencies.join(', ')}`);
    }

    // 3. Precio máximo (ejemplo: 1 millón)
    if (amount > 1_000_000) {
      throw new Error('Price cannot exceed 1,000,000');
    }

    // 4. Redondear a 2 decimales (estándar financiero)
    this.amount = Math.round(amount * 100) / 100;
    this.currency = currency;
  }

  /**
   * FACTORY METHOD: Para crear nuevos Price
   * Más expresivo que "new Price()"
   */
  static create(amount: number, currency?: string): Price {
    return new Price(amount, currency);
  }

  /**
   * FACTORY METHOD: Para reconstruir desde base de datos
   * Diferente semántica que create()
   */
  static fromPrimitives(amount: number, currency: string): Price {
    return new Price(amount, currency);
  }

  // =====================
  // GETTERS (ACCESO CONTROLADO)
  // =====================

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  // =====================
  // COMPORTAMIENTO (BUSINESS LOGIC)
  // =====================

  /**
   * Sumar dos precios (devuelve NUEVA instancia)
   */
  add(other: Price): Price {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return new Price(this.amount + other.amount, this.currency);
  }

  /**
   * Multiplicar precio por factor (devuelve NUEVA instancia)
   */
  multiply(factor: number): Price {
    if (factor <= 0) {
      throw new Error('Multiplication factor must be positive');
    }
    return new Price(this.amount * factor, this.currency);
  }

  /**
   * Aplicar descuento porcentual (devuelve NUEVA instancia)
   */
  applyDiscount(percentage: number): Price {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }
    const discountAmount = this.amount * (percentage / 100);
    return new Price(this.amount - discountAmount, this.currency);
  }

  /**
   * Calcular impuesto (devuelve NUEVA instancia)
   */
  calculateTax(taxRate: number): Price {
    if (taxRate < 0) {
      throw new Error('Tax rate cannot be negative');
    }
    const taxAmount = this.amount * (taxRate / 100);
    return new Price(this.amount + taxAmount, this.currency);
  }

  // =====================
  // COMPARACIÓN
  // =====================

  /**
   * Comparación por VALOR (no por referencia)
   * Dos Price son iguales si amount y currency son iguales
   */
  equals(other: Price): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  /**
   * Comparar si es mayor que otro precio
   */
  isGreaterThan(other: Price): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare prices with different currencies');
    }
    return this.amount > other.amount;
  }

  /**
   * Comparar si es menor que otro precio
   */
  isLessThan(other: Price): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare prices with different currencies');
    }
    return this.amount < other.amount;
  }

  // =====================
  // UTILIDADES
  // =====================

  /**
   * Formatear para mostrar al usuario
   */
  format(): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(this.amount);
  }

  /**
   * Convertir a primitivos para persistencia
   */
  toPrimitives(): { amount: number; currency: string } {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }

  /**
   * Para debugging
   */
  toString(): string {
    return `Price(${this.amount} ${this.currency})`;
  }

  /**
   * Para logging
   */
  toJSON(): { amount: number; currency: string } {
    return this.toPrimitives();
  }
}
