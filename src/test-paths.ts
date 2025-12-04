// Test de los paths configurados
// Ahora el archivo paths.ts existe, esto debería funcionar

import { PATHS } from '@shared/constants/paths';

console.log('Testing TypeScript paths...');
console.log('PATHS constant:', JSON.stringify(PATHS, null, 2));

// También probar import tradicional (debería funcionar)
import { PATHS as PATHS2 } from './shared/constants/paths';
console.log('Traditional import works too:', PATHS2 === PATHS);

console.log('✅ Paths configuration is working!');
