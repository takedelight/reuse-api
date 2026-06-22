import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UserModule } from '../user/user.module';
import { AuthService } from './app/auth.service';
import { SessionService } from './app/session.service';
import { SESSION_REPOSITORY_TOKEN } from './domain/interfaces/session.repository.interface';
import { USER_AGENT_PARSER_TOKEN } from './domain/interfaces/ua-parser.interface';
import { SessionRepository } from './infrastructure/repository/session.repository';
import { UserAgentParserRepository } from './infrastructure/repository/ua-parser.repository';
import { GithubStrategy } from './infrastructure/strategy/github.strategy';
import { GoogleStrategy } from './infrastructure/strategy/google.strategy';
import { AuthController } from './presentation/auth.controller';
import { OAuthController } from './presentation/oauth.controller';
import { SessionController } from './presentation/session.controller';

@Module({
  imports: [UserModule],
  controllers: [AuthController, OAuthController, SessionController],
  providers: [
    AuthService,
    PrismaService,
    GithubStrategy,
    SessionService,
    GoogleStrategy,
    {
      provide: SESSION_REPOSITORY_TOKEN,
      useClass: SessionRepository,
    },
    {
      provide: USER_AGENT_PARSER_TOKEN,
      useClass: UserAgentParserRepository,
    },
  ],
  exports: [SESSION_REPOSITORY_TOKEN, USER_AGENT_PARSER_TOKEN],
})
export class AuthModule {}
