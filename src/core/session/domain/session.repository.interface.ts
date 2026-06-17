import { SessionModel } from './session.model';

export const SESSION_REPOSITORY_TOKEN = Symbol('ISessionRepository');

export interface ISessionRepository {
  getAllUserSessions(userId: string): Promise<SessionModel[]>;

  linkSessionToUser(sid: string, userId: string): Promise<void>;

  deleteSession(sessionId: string): Promise<void>;
  deleteByUserIdExceptCurrent(
    userId: string,
    currentSessionId: string,
  ): Promise<void>;
}
