import { UserSource } from 'src/core/user/domain/user.model';

export class SessionResponseDto {
  id: string;
  expires: string;
  provider: UserSource;
  userAgent: string;
}
