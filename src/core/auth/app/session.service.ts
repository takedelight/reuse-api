import { Inject, Injectable } from '@nestjs/common';
import {
  type ISessionRepository,
  SESSION_REPOSITORY_TOKEN,
} from '../domain/interfaces/session.repository.interface';

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async getById(sessionId: string) {
    return await this.sessionRepository.getById(sessionId);
  }

  async deleteById(sessionId: string) {
    return await this.sessionRepository.deleteSession(sessionId);
  }

  async getAllUserSessions(userId: string) {
    return await this.sessionRepository.getAllUserSessions(userId);
  }
}
