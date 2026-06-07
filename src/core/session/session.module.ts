import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SESSION_REPOSITORY_TOKEN } from './domain/session.repository.interface';
import { USER_AGENT_PARSER_TOKEN } from './domain/ua-parser.interface';
import { SessionEntity } from './infrastructure/entity/session.entity';
import { SessionRepository } from './infrastructure/repository/session.repository';
import { UserAgentParserRepository } from './infrastructure/repository/ua-parser.repository';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    SessionService,
    {
      provide: SESSION_REPOSITORY_TOKEN,
      useClass: SessionRepository,
    },
    {
      provide: USER_AGENT_PARSER_TOKEN,
      useClass: UserAgentParserRepository,
    },
  ],
  controllers: [SessionController],
  exports: [SESSION_REPOSITORY_TOKEN, USER_AGENT_PARSER_TOKEN],
})
export class SessionModule {}
