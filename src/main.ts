import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const APP_PORT = configService.getOrThrow<number>('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  app.use(helmet());

  app.enableCors({
    origin: configService.getOrThrow<string>('CORS_ORIGIN'),
    credentials: true,
    methods: ['GET', 'PATCH', 'POST', 'DELETE'],
  });

  await app.listen(APP_PORT, () =>
    console.log(`Application is running on port http://localhost:${APP_PORT}`),
  );
}

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
});
