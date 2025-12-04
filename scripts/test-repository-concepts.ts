/**
 * Script de prueba: Conceptos de Repositorio (Puertos)
 * 
 * Demuestra el uso de interfaces de repositorio SIN implementación.
 */

import { Price } from '../src/domain/value-objects/price.vo';
import { Product } from '../src/domain/entities/product.entity';
import { IProductRepository } from '../src/domain/repositories/product-repository.interface';
import { ProductExceptions } from '../src/domain/exceptions/repository.exception';

console.log('��� === PRUEBA DE CONCEPTOS DE REPOSITORIO (Puertos) ===\n');

// =====================
// DEMOSTRACIÓN: USO DE INTERFACES EN EL DOMINIO
// =====================

console.log('1. ��� ¿QUÉ ES UN "PUERTO"?');
console.log('   - Es una INTERFAZ en el dominio');
console.log('   - Define QUÉ debe hacer la persistencia');
console.log('   - No dice CÓMO hacerlo');
console.log('   - El dominio depende de la interfaz, no de la implementación\n');

// =====================
// 2. SIMULACIÓN DE USO CASO CON INTERFAZ
// =====================
console.log('2. ��� SIMULACIÓN DE USO CASO:');

// Creamos un producto de prueba
const testProduct = Product.create({
  name: 'Producto de Prueba',
  description: 'Para demostrar uso de repositorio',
  price: Price.create(99.99, 'USD'),
  stock: 10,
  sku: 'TEST-001',
  category: 'Test',
});

console.log('   ✓ Producto creado para pruebas:', testProduct.getName());

// =====================
// 3. DEMOSTRACIÓN DE INYECCIÓN DE DEPENDENCIAS
// =====================
console.log('\n3. ��� DEMOSTRACIÓN DE INYECCIÓN DE DEPENDENCIAS:');

// Clase que usa el repositorio (sin saber la implementación)
class ProductService {
  // Inyectamos la INTERFAZ, no una implementación concreta
  constructor(private readonly productRepository: IProductRepository) {}
  
  async getProductDetails(id: string) {
    // Usamos la interfaz - no sabemos si es PostgreSQL, MongoDB, etc.
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      throw ProductExceptions.notFound(id);
    }
    
    return {
      name: product.getName(),
      price: product.getPrice().format(),
      stock: product.getStock(),
      inventoryValue: product.getInventoryValue().format(),
    };
  }
  
  async updateStock(productId: string, quantity: number) {
    const product = await this.productRepository.findById(productId);
    
    if (!product) {
      throw ProductExceptions.notFound(productId);
    }
    
    // Lógica de negocio en el dominio
    product.reduceStock(quantity);
    
    // Guardar usando la interfaz
    return await this.productRepository.save(product);
  }
}

console.log('   ✓ ProductService definido con inyección de IProductRepository');
console.log('   ✓ Puede trabajar con CUALQUIER implementación del repositorio');
console.log('   ✓ No depende de PostgreSQL, MongoDB, Prisma, TypeORM, etc.\n');

// =====================
// 4. CREAR MOCK DE REPOSITORIO PARA PRUEBAS
// =====================
console.log('4. ��� CREANDO MOCK PARA PRUEBAS UNITARIAS:');

// Mock del repositorio para pruebas (sin base de datos real)
const mockProductRepository: IProductRepository = {
  // Implementamos solo los métodos que necesitamos para la prueba
  save: async (product) => {
    console.log('   [MOCK] Guardando producto:', product.getName());
    return product;
  },
  
  findById: async (id) => {
    console.log('   [MOCK] Buscando producto con ID:', id);
    if (id === 'test-id') {
      return testProduct;
    }
    return null;
  },
  
  // Métodos no implementados en el mock (retornan error si se llaman)
  findBySku: async () => { throw new Error('Not implemented in mock'); },
  delete: async () => { throw new Error('Not implemented in mock'); },
  findAll: async () => { throw new Error('Not implemented in mock'); },
  findByCategory: async () => { throw new Error('Not implemented in mock'); },
  findLowStock: async () => { throw new Error('Not implemented in mock'); },
  search: async () => { throw new Error('Not implemented in mock'); },
  updateStock: async () => { throw new Error('Not implemented in mock'); },
  checkStockAvailability: async () => { throw new Error('Not implemented in mock'); },
  getTotalInventoryValue: async () => { throw new Error('Not implemented in mock'); },
  saveMany: async () => { throw new Error('Not implemented in mock'); },
  updateMany: async () => { throw new Error('Not implemented in mock'); },
  count: async () => { throw new Error('Not implemented in mock'); },
  countByCategory: async () => { throw new Error('Not implemented in mock'); },
  countByStatus: async () => { throw new Error('Not implemented in mock'); },
  skuExists: async () => { throw new Error('Not implemented in mock'); },
  getCategories: async () => { throw new Error('Not implemented in mock'); },
  getTopSelling: async () => { throw new Error('Not implemented in mock'); },
  getRecentlyAdded: async () => { throw new Error('Not implemented in mock'); },
};

// Crear servicio con el mock
const productService = new ProductService(mockProductRepository);

console.log('   ✓ Mock de repositorio creado');
console.log('   ✓ ProductService instanciado con el mock\n');

// =====================
// 5. PROBAR EL SERVICIO CON EL MOCK
// =====================
console.log('5. ��� PROBANDO EL SERVICIO CON MOCK:');

(async () => {
  try {
    // Esto funciona porque el mock devuelve el producto de prueba
    const details = await productService.getProductDetails('test-id');
    console.log('   ✓ getProductDetails funcionó:', details);
    
    // Esto fallará porque el ID no existe en el mock
    try {
      await productService.getProductDetails('non-existent-id');
      console.log('   ✗ Debió fallar para ID no existente');
    } catch (error) {
      console.log('   ✓ Correctamente falló para ID no existente');
    }
    
  } catch (error) {
    console.log('   ❌ Error inesperado:', error);
  }
})();

// =====================
// 6. BENEFICIOS DE ESTA ARQUITECTURA
// =====================
console.log('\n6. ��� BENEFICIOS DE LOS "PUERTOS" (INTERFACES):');
console.log('   ✅ 1. TESTEABILIDAD: Puedes mockear el repositorio fácilmente');
console.log('   ✅ 2. FLEXIBILIDAD: Cambiar de PostgreSQL a MongoDB es fácil');
console.log('   ✅ 3. SEPARACIÓN: Dominio no sabe nada de infraestructura');
console.log('   ✅ 4. MANTENIBILIDAD: Código más limpio y organizado');
console.log('   ✅ 5. ESCALABILIDAD: Nuevas implementaciones sin tocar dominio');

console.log('\n�� RESUMEN DEL DÍA 4:');
console.log('   - Creaste interfaces (puertos) en el dominio');
console.log('   - El dominio define QUÉ necesita, no CÓMO se implementa');
console.log('   - Preparado para implementación concreta (Día 5)');
console.log('   - Las pruebas unitarias serán MUY fáciles');

// Pequeña pausa para que se ejecute el async
setTimeout(() => {
  console.log('\n✅ DÍA 4 COMPLETO: Conceptos de repositorio entendidos y aplicados.');
}, 100);
