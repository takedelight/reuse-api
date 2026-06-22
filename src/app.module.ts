import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino/LoggerModule';
import { UserModule } from 'src/core/user/user.module';
import { pinoConfig } from 'src/infrastructure/logger/pino.config';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthModule } from './core/auth/auth.module';
import { PostModule } from './core/post/post.module';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { PrismaService } from './infrastructure/database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    LoggerModule.forRoot(pinoConfig),
    UserModule,
    AuthModule,
    PrismaModule,
    PostModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
