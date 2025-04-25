import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
dotenv.config({
  path : '/'
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors({
    origin: process.env.ORIGIN, // frontend port
    credentials: true,
  });
  await app.listen(process.env.PORT!);
}
bootstrap();
