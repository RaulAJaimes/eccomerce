import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,      // Disponible en TODA la aplicación
      envFilePath: '.env', // Archivo donde buscar variables
      cache: true,         // Cache para mejor performance
    }),
  ],
  controllers: [
    // Los controllers se agregarán en módulos específicos
  ],
  providers: [
    // Los providers se agregarán en módulos específicos
  ],
})
export class AppModule {}