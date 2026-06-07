import { Module } from '@nestjs/common';
import { SESSION_REPOSITORY_TOKEN } from './domain/session.repository.interface';
import { SessionRepository } from './infrastructure/repository/session.repository';
import { SessionService } from './session.service';

@Module({
  providers: [
    SessionService,
    {
      provide: SESSION_REPOSITORY_TOKEN,
      useClass: SessionRepository,
    },
  ],
  exports: [SESSION_REPOSITORY_TOKEN],
})
export class SessionModule {}
