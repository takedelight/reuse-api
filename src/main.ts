import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  const APP_PORT = configService.getOrThrow<number>('PORT');

  const config = new DocumentBuilder()
    .setTitle('Reuse API')
    .setVersion('1.0')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(helmet());

  app.enableCors({
    origin: configService.getOrThrow<string>('CORS_ORIGIN'),
    credentials: true,
    methods: ['GET', 'PATCH', 'POST', 'DELETE'],
  });

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(APP_PORT, () =>
    console.log(`Application is running on port http://localhost:${APP_PORT}`),
  );
}

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
});
