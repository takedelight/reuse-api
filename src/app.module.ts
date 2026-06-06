import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino/LoggerModule';
import { UserModule } from 'src/core/user/user.module';
import { typeormConfig } from 'src/infrastructure/database/typerorm.config';
import { pinoConfig } from 'src/infrastructure/logger/pino.config';

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
  ],
})
export class AppModule {}
