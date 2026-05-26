import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('IoT Sync API')
    .setDescription('API do zarządzania synchronizacją liczników PLC')
    .setVersion('1.0')
    .addBearerAuth() // <--- TO JEST WYMAGANE DO DZIAŁANIA KŁÓDECZKI
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap()
  .then(() => {
    console.log('Bootstrapped');
  })
  .catch((err) => {
    console.error('Bootstrap failed:', err);
  });
