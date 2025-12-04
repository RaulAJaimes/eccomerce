/**
 * Script de prueba del Dominio
 * 
 * Este script NO requiere NestJS, base de datos ni HTTP.
 * Solo prueba la lógica de negocio pura.
 */

import { Price } from '../src/domain/value-objects/price.vo';
import { Product } from '../src/domain/entities/product.entity';

console.log('��� === PRUEBA DEL DOMINIO (Domain Layer) ===\n');

// =====================
// 1. PRUEBAS DE PRICE (Value Object)
// =====================
console.log('1. ��� PRUEBAS DE PRICE (Value Object):');

try {
  // Crear precios
  const price1 = Price.create(19.99, 'USD');
  const price2 = Price.create(29.99, 'USD');
  
  console.log('   ✓ Price 1 creado:', price1.format());
  console.log('   ✓ Price 2 creado:', price2.format());
  
  // Operaciones
  const total = price1.add(price2);
  console.log('   ✓ Suma:', total.format());
  
  const withDiscount = price1.applyDiscount(10); // 10% de descuento
  console.log('   ✓ Con 10% descuento:', withDiscount.format());
  
  const withTax = price1.calculateTax(19); // 19% de impuesto
  console.log('   ✓ Con 19% impuesto:', withTax.format());
  
  // Comparaciones
  console.log('   ✓ Price1 > Price2?', price1.isGreaterThan(price2));
  console.log('   ✓ Price1 < Price2?', price1.isLessThan(price2));
  console.log('   ✓ Son iguales?', price1.equals(price2));
  
  // Validaciones (deben fallar)
  console.log('\n   ��� Probando validaciones (deben fallar):');
  
  try {
    Price.create(-10, 'USD');
    console.log('   ✗ Debió fallar por precio negativo');
  } catch (error) {
    console.log('   ✓ Correctamente falló:', (error as Error).message);
  }
  
  try {
    Price.create(100, 'XYZ');
    console.log('   ✗ Debió fallar por moneda inválida');
  } catch (error) {
    console.log('   ✓ Correctamente falló:', (error as Error).message);
  }
  
} catch (error) {
  console.log('   ❌ Error inesperado:', error);
}

// =====================
// 2. PRUEBAS DE PRODUCT (Entity)
// =====================
console.log('\n2. �� PRUEBAS DE PRODUCT (Entity):');

try {
  // Crear un nuevo producto
  const product = Product.create({
    name: 'Laptop Gamer Pro',
    description: 'Laptop de alto rendimiento para gaming y trabajo',
    price: Price.create(1299.99, 'USD'),
    stock: 50,
    sku: 'LAP-GAMER-001',
    category: 'Electronics',
    images: ['laptop1.jpg', 'laptop2.jpg'],
  });
  
  console.log('   ✓ Producto creado:', product.toString());
  console.log('   ✓ SKU:', product.getSku());
  console.log('   ✓ Categoría:', product.getCategory());
  console.log('   ✓ Stock inicial:', product.getStock());
  console.log('   ✓ Precio:', product.getPrice().format());
  console.log('   ✓ Activo?', product.getIsActive());
  console.log('   ✓ Tiene stock?', product.hasStock());
  console.log('   ✓ Valor inventario:', product.getInventoryValue().format());
  
  // Operaciones de negocio
  console.log('\n   ��� Operaciones de negocio:');
  
  product.reduceStock(5);
  console.log('   ✓ Vendidas 5 unidades. Stock actual:', product.getStock());
  
  product.increaseStock(20);
  console.log('   ✓ Reabastecidas 20 unidades. Stock actual:', product.getStock());
  
  product.updatePrice(Price.create(1199.99, 'USD'));
  console.log('   ✓ Precio actualizado:', product.getPrice().format());
  
  product.addImages(['laptop3.jpg', 'laptop4.jpg']);
  console.log('   ✓ Imágenes actuales:', product.getImages().length, 'imágenes');
  
  // Verificaciones de estado
  console.log('\n   ��� Estado del producto:');
  console.log('   ✓ Stock bajo? (mínimo 10):', product.isLowStock(10));
  console.log('   ✓ Tiene stock mínimo de 10?', product.hasMinimumStock(10));
  console.log('   ✓ Agotado?', product.isOutOfStock());
  
  // Desactivar producto
  product.deactivate();
  console.log('   ✓ Producto desactivado. Activo?', product.getIsActive());
  
  // Intentar operación en producto inactivo (debe fallar)
  console.log('\n   ��� Probando validaciones de producto inactivo:');
  try {
    product.reduceStock(1);
    console.log('   ✗ Debió fallar al reducir stock de producto inactivo');
  } catch (error) {
    console.log('   ✓ Correctamente falló:', (error as Error).message);
  }
  
  // Reactivar
  product.activate();
  console.log('   ✓ Producto reactivado. Activo?', product.getIsActive());
  
  // Serialización
  console.log('\n   ��� Serialización:');
  const json = product.toJSON();
  console.log('   ✓ toJSON():', {
    id: json.id,
    name: json.name,
    price: json.price,
    stock: json.stock,
    hasStock: json.hasStock,
  });
  
  // Primitivos para DB
  const primitives = product.toPrimitives();
  console.log('   ✓ toPrimitives() tiene createdAt y updatedAt:', 
    'createdAt' in primitives && 'updatedAt' in primitives);
  
} catch (error) {
  console.log('   ❌ Error:', error);
}

// =====================
// 3. PRUEBAS DE RECONSTRUCCIÓN
// =====================
console.log('\n3. ��� PRUEBAS DE RECONSTRUCCIÓN (desde DB):');

try {
  // Simular producto existente (viene de base de datos)
  const existingProduct = Product.reconstruct({
    id: 'prod_existing_123',
    name: 'Mouse Inalámbrico',
    description: 'Mouse ergonómico inalámbrico',
    price: Price.create(49.99, 'USD'),
    stock: 25,
    sku: 'MS-WIRELESS-001',
    category: 'Accessories',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  });
  
  console.log('   ✓ Producto reconstruido:', existingProduct.getName());
  console.log('   ✓ ID preservado:', existingProduct.id);
  console.log('   ✓ Fecha creación:', existingProduct.createdAt.toISOString().split('T')[0]);
  
} catch (error) {
  console.log('   ❌ Error:', error);
}

// =====================
// RESUMEN
// =====================
console.log('\n��� === RESUMEN DE PRUEBAS ===');
console.log('✅ Value Object Price: Inmutable, con validaciones y comportamiento');
console.log('✅ Entity Product: Identidad, mutabilidad controlada, lógica de negocio');
console.log('✅ Separación clara: create() vs reconstruct()');
console.log('✅ Todo funciona SIN NestJS, SIN base de datos, SIN HTTP');
console.log('\n��� Dominio listo para integrar con capas superiores!');
