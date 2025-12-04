/**
 * Constantes para rutas de la arquitectura hexagonal
 * Esto centraliza las rutas para mantener consistencia
 */

export const PATHS = {
  // CAPA DE DOMINIO
  DOMAIN: {
    ENTITIES: 'domain/entities',
    REPOSITORIES: 'domain/repositories',
    SERVICES: 'domain/services',
    VALUE_OBJECTS: 'domain/value-objects',
  },
  
  // CAPA DE APLICACIÓN
  APPLICATION: {
    USE_CASES: 'application/usecases',
    DTOS: 'application/dtos',
    MAPPERS: 'application/mappers',
  },
  
  // CAPA DE INFRAESTRUCTURA
  INFRASTRUCTURE: {
    CONTROLLERS: 'infrastructure/controllers',
    DATABASE: {
      REPOSITORIES: 'infrastructure/database/repositories',
      MAPPERS: 'infrastructure/database/mappers',
    },
    CONFIG: 'infrastructure/config',
    EXCEPTIONS: 'infrastructure/exceptions',
    COMMON: 'infrastructure/common',
  },
  
  // RECURSOS COMPARTIDOS
  SHARED: {
    CONSTANTS: 'shared/constants',
    DECORATORS: 'shared/decorators',
    EXCEPTIONS: 'shared/exceptions',
    INTERCEPTORS: 'shared/interceptors',
    UTILS: 'shared/utils',
    TYPES: 'shared/types',
  },
} as const;

// Tipos helper para TypeScript
export type PathKey = keyof typeof PATHS;
export type DomainPathKey = keyof typeof PATHS.DOMAIN;
export type ApplicationPathKey = keyof typeof PATHS.APPLICATION;

// Funciones helper para construir rutas
export function getDomainPath(subpath: string): string {
  return `@domain/${subpath}`;
}

export function getApplicationPath(subpath: string): string {
  return `@application/${subpath}`;
}

export function getInfrastructurePath(subpath: string): string {
  return `@infrastructure/${subpath}`;
}

export function getSharedPath(subpath: string): string {
  return `@shared/${subpath}`;
}

// Ejemplo de uso:
// import { Product } from getDomainPath('entities/product.entity');
