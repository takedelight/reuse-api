import { Session } from './session.model';

export const SESSION_REPOSITORY_TOKEN = Symbol('ISessionRepository');

export interface ISessionRepository {
  getAllUserSessions(userId: string): Promise<Session[]>;
  deleteSession(sessionId: string): Promise<void>;
  deleteByUserIdExceptCurrent(
    userId: string,
    currentSessionId: string,
  ): Promise<void>;
}
