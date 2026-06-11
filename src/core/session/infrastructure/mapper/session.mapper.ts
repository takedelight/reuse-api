import { Session } from '@prisma/client';
import { SessionModel } from '../../domain/session.model';
import { SessionResponseDto } from '../../dto/session-response.dto';
import { IParsedSession } from '../types/session.types';

export class SessionMapper {
  static toResponse(session: SessionModel): SessionResponseDto {
    return {
      id: session.id,
      expires: session.expires,
      userAgent: session.userAgent,
    };
  }

  static toDomain(sessionEntity: Session): SessionModel {
    const sessionJson: IParsedSession = JSON.parse(
      sessionEntity.data,
    ) as IParsedSession;

    const session = new SessionModel(
      sessionEntity.sid,
      sessionJson.userAgent,
      sessionJson.userId,
      sessionJson.cookie.expires,
    );

    return session;
  }
}
