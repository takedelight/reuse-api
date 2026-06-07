import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormStore } from 'connect-typeorm';
import session from 'express-session';
import { LoggerModule } from 'nestjs-pino/LoggerModule';
import { UserModule } from 'src/core/user/user.module';
import { typeormConfig } from 'src/infrastructure/database/typerorm.config';
import { pinoConfig } from 'src/infrastructure/logger/pino.config';
import { DataSource } from 'typeorm';
import { isProd } from './common/utils/env.utils';
import { AuthModule } from './core/auth/auth.module';
import { SessionEntity } from './core/session/infrastructure/entity/session.entity';
import { SessionModule } from './core/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeormConfig(configService),
    }),
    LoggerModule.forRoot(pinoConfig),
    UserModule,
    AuthModule,
    SessionModule,
  ],
})
export class AppModule implements NestModule {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const sessionRepository = this.dataSource.getRepository(SessionEntity);

    consumer
      .apply(
        session({
          store: new TypeormStore({
            cleanupLimit: Number(
              this.configService.getOrThrow('SESSION_CLEANUP_LIMIT'),
            ),
            ttl: Number(this.configService.getOrThrow('SESSION_TTL')),
          }).connect(sessionRepository),
          secret: this.configService.getOrThrow<string>('SESSION_SECRET'),
          name: this.configService.getOrThrow<string>('SESSION_NAME'),
          resave: this.configService.getOrThrow('SESSION_RESAVE') === 'true',
          saveUninitialized:
            this.configService.getOrThrow('SESSION_SAVE_UNINITIALIZED') ===
            'true',
          cookie: {
            httpOnly:
              this.configService.getOrThrow('SESSION_COOKIE_HTTP_ONLY') ===
              'true',
            secure: isProd(),
            maxAge: Number(
              this.configService.getOrThrow('SESSION_COOKIE_MAX_AGE'),
            ),
          },
        }),
      )
      .forRoutes('*');
  }
}
