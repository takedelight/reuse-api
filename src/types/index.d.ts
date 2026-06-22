import { type OAuthProfileDto } from '../core/auth/dto/oauth-response.dto';
import { type JwtPayload } from '../core/auth/infrastructure/types/jwt-payload.type';

declare module 'express' {
  export interface Request {
    user?: JwtPayload & Partial<OAuthProfileDto>;
    cookies: {
      accessToken?: string;
      refreshToken?: string;
    };
  }
}
