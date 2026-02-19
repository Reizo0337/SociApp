import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import 'dotenv/config';
import * as fs from 'fs';
import { join } from 'path';

async function bootstrap() {
  // Asegurar que existe la carpeta de subidas
  const uploadDir = join(process.cwd(), 'uploads', 'projects');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());

  // ⚠️ SEGURIDAD: CORS configurado - en producción usar variable de entorno para origin
  app.enableCors({
    origin: 'http://16.171.57.244',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ⚠️ SEGURIDAD: Validación global activada - rechaza propiedades no definidas en DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Rechaza la petición si hay propiedades extra
      transform: true, // Transforma automáticamente los tipos
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
