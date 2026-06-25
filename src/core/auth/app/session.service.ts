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

  async deleteExceptCurrent(userId: string, currentSessionId: string) {
    return await this.sessionRepository.deleteByUserIdExceptCurrent(
      userId,
      currentSessionId,
    );
  }

  async getAllUserSessions(userId: string, currentSessionId: string) {
    const sessions = await this.sessionRepository.getAllUserSessions(userId);

    return sessions.map((s) => {
      const session = SessionMapper.toResponse(s);

      return {
        ...session,
        isCurrent: session.id === currentSessionId,
      };
    });
  }
}
