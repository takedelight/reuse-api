import { Inject, Injectable } from '@nestjs/common';
import {
  type ISessionRepository,
  SESSION_REPOSITORY_TOKEN,
} from '../domain/interfaces/session.repository.interface';
import { SessionMapper } from '../infrastructure/mapper/session.mapper';

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
    const sessions = await this.sessionRepository.getAllUserSessions(userId);

    return sessions.map((s) => SessionMapper.toResponse(s));
  }
}
