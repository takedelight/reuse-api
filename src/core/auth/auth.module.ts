import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuthController } from './oauth.controller';
import { GithubStrategy } from './infrastructure/strategy/github.strategy';
import { GoogleStrategy } from './infrastructure/strategy/google.strategy';

@Module({
  imports: [UserModule, SessionModule],
  controllers: [AuthController, OAuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    GithubStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
