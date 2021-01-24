import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { load, config, listDotenvFiles } from 'dotenv-flow';

async function bootstrap() {
  config({ path: '' });
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Speed-Actuator')
    .setDescription('Speed Actuator API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('');
  app.enableCors();

  await app.listen(3001);
}
bootstrap();
