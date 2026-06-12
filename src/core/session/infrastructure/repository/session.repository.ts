import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { SessionModel } from '../../domain/session.model';
import { ISessionRepository } from '../../domain/session.repository.interface';
import { SessionMapper } from '../mapper/session.mapper';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUserSessions(userId: string): Promise<SessionModel[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        users: {
          id: userId,
        },
      },
    });

    return sessions.map((session) => SessionMapper.toDomain(session));
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
  }

  async deleteByUserIdExceptCurrent(
    userId: string,
    currentSessionId: string,
  ): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        users: {
          id: userId,
        },
        id: { not: currentSessionId },
      },
    });
  }

  async linkSessionToUser(sid: string, userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        sid,
      },
      data: {
        usersId: userId,
      },
    });
  }
}
