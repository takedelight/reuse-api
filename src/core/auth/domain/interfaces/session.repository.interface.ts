import { SessionModel } from '../model/session.model';

export const SESSION_REPOSITORY_TOKEN = Symbol('ISessionRepository');

export interface ISessionRepository {
  getAllUserSessions(userId: string): Promise<SessionModel[]>;

  createSession(session: SessionModel): Promise<SessionModel>;

  getById(sessionId: string): Promise<SessionModel | null>;

  deleteSession(sessionId: string): Promise<void>;

  deleteByUserIdExceptCurrent(
    userId: string,
    currentSessionId: string,
  ): Promise<void>;
}
