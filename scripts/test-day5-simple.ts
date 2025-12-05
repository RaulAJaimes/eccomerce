/**
 * TEST MUY SIMPLE del DÃ­a 5
 */

console.log('í·ª === TEST SIMPLE DÃA 5 ===\n');

// Simular los imports que tenemos
console.log('1. í³ ARCHIVOS CREADOS:');
console.log('   âœ… simple-product.dto.ts');
console.log('   âœ… simple-product.mapper.ts');
console.log('   âœ… get-product-by-id.usecase.ts\n');

console.log('2. í´„ CÃ“MO FUNCIONA:');

// Crear un MOCK del repositorio
const mockRepository = {
  findById: async (id: string) => {
    console.log(`   [MockRepo] Buscando producto ID: ${id}`);
    
    if (id === 'prod-123') {
      // Simular un producto del dominio
      return {
        id: 'prod-123',
        getName: () => 'Laptop Gamer',
        getPrice: () => ({ getAmount: () => 1299.99, getCurrency: () => 'USD' }),
        getStock: () => 10,
      };
    }
    return null;
  }
};

// Crear el caso de uso con el mock
const useCase = {
  execute: async (productId: string) => {
    console.log(`   [UseCase] Ejecutando con ID: ${productId}`);
    
    // ValidaciÃ³n
    if (!productId) throw new Error('ID requerido');
    
    // Llamar repositorio
    const product = await mockRepository.findById(productId);
    
    if (!product) throw new Error('Producto no encontrado');
    
    // Convertir a respuesta (simulando mapper)
    return {
      id: product.id,
      name: product.getName(),
      price: product.getPrice().getAmount(),
      currency: product.getPrice().getCurrency(),
      stock: product.getStock(),
    };
  }
};

console.log('3. íº€ PROBANDO:\n');

// Probar
(async () => {
  try {
    console.log('í´¹ Caso 1: Producto existente');
    const result1 = await useCase.execute('prod-123');
    console.log('   Resultado:', result1);
    
    console.log('\ní´¹ Caso 2: Producto no existente');
    try {
      await useCase.execute('prod-999');
      console.log('   âœ— DebiÃ³ fallar');
    } catch (error) {
      console.log('   âœ“ Correctamente fallÃ³:', (error as Error).message);
    }
    
    console.log('\ní´¹ Caso 3: ID vacÃ­o');
    try {
      await useCase.execute('');
      console.log('   âœ— DebiÃ³ fallar');
    } catch (error) {
      console.log('   âœ“ Correctamente fallÃ³:', (error as Error).message);
    }
    
    console.log('\n4. í¾¯ RESUMEN DÃA 5:');
    console.log('   âœ… DTO: Objeto para mover datos');
    console.log('   âœ… Mapper: Convierte entre Entity y DTO');
    console.log('   âœ… Use Case: Orquesta una operaciÃ³n especÃ­fica');
    console.log('   âœ… Todo se conecta SIN saber detalles de DB o HTTP');
    
  } catch (error) {
    console.error('Error:', error);
  }
})();

setTimeout(() => {
  console.log('\nâœ… DÃA 5 COMPLETADO (versiÃ³n simple)');
}, 100);
