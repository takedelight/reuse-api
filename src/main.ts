import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const APP_PORT = configService.getOrThrow<number>('PORT');

  await app.listen(APP_PORT, () =>
    console.log(`Application is running on port http://localhost:${APP_PORT}`),
  );
}

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
});
