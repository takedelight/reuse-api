import { type UserRole } from 'src/core/user/domain/models/user.model';

export interface JwtPayload {
  sub: string;

  role: UserRole;

  sessionId: string;
}
