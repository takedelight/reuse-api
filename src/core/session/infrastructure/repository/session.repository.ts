import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../../domain/session.model';
import { ISessionRepository } from '../../domain/session.repository.interface';
import { SessionEntity } from '../entity/session.model';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
  ) {}
  getAllUserSessions(userId: string): Promise<Session[]> {
    throw new Error('Method not implemented.');
  }
  getSessionById(sessionId: string): Promise<Session | null> {
    throw new Error('Method not implemented.');
  }

  deleteSession(sessionId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteByUserIdExceptCurrent(
    userId: string,
    currentSessionId: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
