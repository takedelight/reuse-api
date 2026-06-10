import 'express';

import { OAuthProfileDto } from '../../dto/oauth-response.dto';

declare module 'express' {
  export interface Request {
    user: OAuthProfileDto;
  }
}
