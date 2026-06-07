import { Session } from './session.model';

export const SESSION_REPOSITORY_TOKEN = Symbol('ISessionRepository');

export interface ISessionRepository {
  getAllSessions(): Promise<Session[]>;
  getSessionById(sessionId: string): Promise<Session | null>;
  createSession(session: Partial<Session>): Promise<Session>;
  deleteSession(sessionId: string): Promise<void>;
  deleteByUserIdExceptCurrent(
    userId: string,
    currentSessionId: string,
  ): Promise<void>;
}
