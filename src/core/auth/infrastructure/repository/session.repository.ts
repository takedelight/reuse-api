import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { ISessionRepository } from '../../domain/interfaces/session.repository.interface';
import { SessionModel } from '../../domain/model/session.model';
import { SessionMapper } from '../mapper/session.mapper';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(session: SessionModel): Promise<SessionModel> {
    const data = SessionMapper.toPersistence(session);

    try {
      const session = await this.prisma.session.create({ data });

      return SessionMapper.toDomain(session);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new InternalServerErrorException('SESSION.ALREADY_EXISTS');
      }

      throw error;
    }
  }

  async getAllUserSessions(userId: string): Promise<SessionModel[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        user: {
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
        user: {
          id: userId,
        },
        id: { not: currentSessionId },
      },
    });
  }
}
