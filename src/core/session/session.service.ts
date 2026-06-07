import { Inject, Injectable } from '@nestjs/common';
import {
  type ISessionRepository,
  SESSION_REPOSITORY_TOKEN,
} from './domain/session.repository.interface';
import { SessionResponseDto } from './dto/session-response.dto';
import { SessionMapper } from './infrastructure/mapper/session.mapper';

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async getAllSessions(userId: string): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionRepository.getAllUserSessions(userId);

    return sessions.map((session) => SessionMapper.toResponse(session));
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.sessionRepository.deleteSession(sessionId);
  }

  async deleteOtherSessions(
    userId: string,
    currentSessionId: string,
  ): Promise<void> {
    await this.sessionRepository.deleteByUserIdExceptCurrent(
      userId,
      currentSessionId,
    );
  }
}
