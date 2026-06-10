import { Controller, Get, Req } from '@nestjs/common';
import { type Request } from 'express';
import { AuthService } from '../auth.service';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  async github(): Promise<void> {}

  @Get('github/callback')
  async githubCallback(@Req() req: Request): Promise<void> {}
}
