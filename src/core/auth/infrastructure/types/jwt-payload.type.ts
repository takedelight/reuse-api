import { UserRoles } from '@prisma/client';

export interface JwtPayload {
  sub: string;

  role: UserRoles;

  sessionId: string;
}
