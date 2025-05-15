import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
    app.enableCors({
    origins: ['http://localhost:5173', 'http://localhost:3000',],
    credentials: true,
  });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();