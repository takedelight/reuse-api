import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../../domain/session.model';
import { ISessionRepository } from '../../domain/session.repository.interface';
import { SessionEntity } from '../entity/session.entity';
import { SessionMapper } from '../mapper/session.mapper';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
  ) {}
  async getAllUserSessions(userId: string): Promise<Session[]> {
    const sessions = await this.sessionRepo
      .createQueryBuilder('session')
      .where("session.json::jsonb ->> 'userId' = :userId", { userId })
      .getMany();

    return sessions.map((session) => SessionMapper.toDomain(session));
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.sessionRepo.delete(sessionId);
  }

  async deleteByUserIdExceptCurrent(
    userId: string,
    currentSessionId: string,
  ): Promise<void> {
    await this.sessionRepo
      .createQueryBuilder('sessions')
      .delete()
      .where("sessions.json::jsonb ->> 'userId' = :userId", { userId })
      .andWhere('sessions.id != :currentSessionId', { currentSessionId })
      .execute();
  }
}
