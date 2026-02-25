import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3002;
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? true,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });
  await app.listen(port);
  console.log(`Backend API: http://localhost:${port}`);
}
bootstrap();
