import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalMiddleWare } from './middlewares/logger.midlleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect';
import { config as auth0Config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('eCommerce')
    .setDescription(
      'API for managing an eCommerce platform that handles product creation, orders, users, and inventory management. It provides secure endpoints for handling purchases, payments, and user administration.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  app.use(auth(auth0Config));
  app.use(globalMiddleWare);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const cleanErrors = errors.map((error) => {
          return { property: error.property, constraints: error.constraints };
        });
        return new BadRequestException({
          alert: 'The following errors were found',
          errors: cleanErrors,
        });
      },
    }),
  );
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("api", app, document)
  await app.listen(3000);
}
bootstrap();
