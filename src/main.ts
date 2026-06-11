import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import session from 'express-session';
import helmet from 'helmet';

import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { isProd } from './common/utils/env.utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const prisma = app.get(PrismaService);

  const APP_PORT = configService.getOrThrow<number>('PORT');

  const config = new DocumentBuilder()
    .setTitle('Reuse API')
    .setVersion('1.0')
    .addCookieAuth(configService.getOrThrow<string>('SESSION_NAME'), {
      type: 'apiKey',
      in: 'cookie',
    })
    .addSecurityRequirements('cookie-auth')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(helmet());

  app.use(
    session({
      store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
      }),
      secret: configService.getOrThrow<string>('SESSION_SECRET'),
      name: configService.getOrThrow<string>('SESSION_NAME'),
      resave: configService.getOrThrow('SESSION_RESAVE') === 'true',
      saveUninitialized:
        configService.getOrThrow('SESSION_SAVE_UNINITIALIZED') === 'true',
      cookie: {
        httpOnly:
          configService.getOrThrow('SESSION_COOKIE_HTTP_ONLY') === 'true',
        secure: isProd(),
        maxAge: Number(configService.getOrThrow('SESSION_COOKIE_MAX_AGE')),
      },
    }),
  );

  app.enableCors({
    origin: configService.getOrThrow<string>('CORS_ORIGIN'),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(APP_PORT);

  console.log(`Application is running on port http://localhost:${APP_PORT}`);
}

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
});
