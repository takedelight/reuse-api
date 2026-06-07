import { Session } from '../../domain/session.model';
import { SessionResponseDto } from '../../dto/session-response.dto';
import { SessionEntity } from '../entity/session.entity';
import { IParsedSession } from '../types/session.types';

export class SessionMapper {
  static toResponse(session: Session): SessionResponseDto {
    return {
      id: session.id,
      expires: session.expires,
      provider: session.provider,
      userAgent: session.userAgent,
    };
  }

  static toDomain(sessionEntity: SessionEntity): Session {
    const sessionJson: IParsedSession = JSON.parse(
      sessionEntity.json,
    ) as IParsedSession;

    const session = new Session(
      sessionEntity.id,
      sessionJson.provider,
      sessionJson.userAgent,
      sessionJson.userId,
      sessionJson.cookie.expires,
    );

    return session;
  }
}
