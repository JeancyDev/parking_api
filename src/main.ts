import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    }));

  const config = new DocumentBuilder()
    .setTitle('Parking Api')
    .setDescription('Api para la gestión del sistema de reservas de un parking')
    .setVersion('1.0')
    .addSecurity('bearer', { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(8080);
  console.log(`http://localhost:8080/swagger#/`)
}

bootstrap();
