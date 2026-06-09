import 'express-session';
import { UserRole } from 'src/core/user/domain/user.model';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    userAgent?: string;
    role: UserRole;
    provider?: string;
  }
}
