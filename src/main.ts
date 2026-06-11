import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/events/infrastructure/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Filtro global de excepciones de dominio
  app.useGlobalFilters(new DomainExceptionFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Insurance API')
    .setDescription('API de gestión de pólizas de seguros — Canteras Sofka')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('Insurance API running on http://localhost:3000');
  console.log('Swagger docs at http://localhost:3000/api/docs');
}
bootstrap();
