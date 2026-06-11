import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino/LoggerModule';
import { UserModule } from 'src/core/user/user.module';
import { pinoConfig } from 'src/infrastructure/logger/pino.config';
import { AuthModule } from './core/auth/auth.module';
import { SessionModule } from './core/session/session.module';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { PrismaService } from './infrastructure/database/prisma.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    LoggerModule.forRoot(pinoConfig),
    UserModule,
    AuthModule,
    SessionModule,
    PrismaModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
