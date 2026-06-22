import 'express';

import { type OAuthProfileDto } from '../../dto/oauth-response.dto';
import { type JwtPayload } from './jwt-payload.type';

declare module 'express' {
  export interface Request {
    user: OAuthProfileDto | JwtPayload;
  }
}
