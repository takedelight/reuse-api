import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino/LoggerModule';
import { join } from 'path';
import * as pino from 'pino';
import { typeormConfig } from 'src//infrastructure/database/typerorm.config';
import { UserModule } from 'src/core/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeormConfig(configService),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        stream: pino.multistream([
          {
            level: 'info',
            stream: pino.destination({
              dest: join(process.cwd(), 'logs', 'app.log'),
              mkdir: true,
              sync: false,
            }),
          },
        ]),
      },
    }),
    UserModule,
  ],
})
export class AppModule {}
