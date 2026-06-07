import { Inject, Injectable } from '@nestjs/common';
import {
  type ISessionRepository,
  SESSION_REPOSITORY_TOKEN,
} from './domain/session.repository.interface';

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async getAllSessions(userId: string) {
    return this.sessionRepository.getAllUserSessions(userId);
  }
}
