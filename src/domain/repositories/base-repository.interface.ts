/**
 * Interfaz base genérica para repositorios
 * 
 * Proporciona operaciones comunes que pueden ser reutilizadas
 * por todos los repositorios específicos.
 */

export interface FindOptions<T> {
  where?: Partial<T>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Interfaz base para operaciones CRUD genéricas
 */
export interface IBaseRepository<T> {
  /**
   * Crear o actualizar una entidad
   */
  save(entity: T): Promise<T>;
  
  /**
   * Encontrar por ID
   */
  findById(id: string): Promise<T | null>;
  
  /**
   * Encontrar todos (con opciones)
   */
  findAll(options?: FindOptions<T>): Promise<PaginatedResult<T>>;
  
  /**
   * Encontrar uno que cumpla condiciones
   */
  findOne(where: Partial<T>): Promise<T | null>;
  
  /**
   * Eliminar por ID
   */
  delete(id: string): Promise<void>;
  
  /**
   * Contar total
   */
  count(where?: Partial<T>): Promise<number>;
  
  /**
   * Verificar si existe
   */
  exists(where: Partial<T>): Promise<boolean>;
}

/**
 * Interfaz para repositorios que necesitan búsqueda específica
 */
export interface ISearchableRepository<T> {
  /**
   * Búsqueda por término
   */
  search(term: string, options?: FindOptions<T>): Promise<PaginatedResult<T>>;
}

/**
 * Interfaz para repositorios con operaciones por lotes
 */
export interface IBatchRepository<T> {
  /**
   * Guardar múltiples entidades
   */
  saveMany(entities: T[]): Promise<T[]>;
  
  /**
   * Actualizar múltiples entidades
   */
  updateMany(entities: T[]): Promise<T[]>;
  
  /**
   * Eliminar múltiples entidades
   */
  deleteMany(where: Partial<T>): Promise<number>;
}
