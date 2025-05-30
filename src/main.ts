import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set up global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove non-whitelisted properties
    forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
    transform: true, // Transform payloads to be objects typed according to DTO classes
  }));

  // Enable CORS
  app.enableCors();
  
  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API for managing tasks with Keycloak authentication')
    .setVersion('1.0')
    .addTag('tasks', 'Task management endpoints')
    .addTag('auth', 'Authentication endpoints')
    .addTag('health', 'Health check endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token from Keycloak',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3004);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`API documentation available at: ${await app.getUrl()}/api`);
}
bootstrap();
