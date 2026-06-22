import { Prisma, Session as PrismaSessionEntity } from '@prisma/client';
import { SessionModel } from '../../domain/model/session.model';
import { type SessionResponseDto } from '../../dto/session-response.dto';

export class SessionMapper {
  static toResponse(session: SessionModel): SessionResponseDto {
    return {
      id: session.id,
      expires: session.expiresAt,
      userAgent: session.userAgent,
      device: session.device,
      ip_address: session.ipAddress,
    };
  }

  static toDomain(sessionEntity: PrismaSessionEntity): SessionModel {
    return new SessionModel({
      id: sessionEntity.id,
      tokenHash: sessionEntity.token_hash,
      device: sessionEntity.device,
      ipAddress: sessionEntity.ipAddress,
      userAgent: sessionEntity.userAgent,
      userId: sessionEntity.userId,
      createdAt: sessionEntity.createdAt,
      expiresAt: sessionEntity.expiresAt,
    });
  }

  static toPersistence(
    session: SessionModel,
  ): Prisma.SessionUncheckedCreateInput {
    return {
      id: session.id,
      token_hash: session.tokenHash,
      device: session.device,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      userId: session.userId,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    };
  }
}
