import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { GithubGuard } from 'src/core/auth/infrastructure/guards/github.guard';
import { AuthService } from '../app/auth.service';
import { OAuthProfileDto } from '../dto/oauth-response.dto';
import { GoogleGuard } from '../infrastructure/guards/google.guard';

@Controller('oauth')
@Public()
export class OAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @UseGuards(GithubGuard)
  async github(): Promise<void> {}

  @Get('github/callback')
  @UseGuards(GithubGuard)
  async githubCallback(@Req() req: Request): Promise<void> {
    return await this.authService.upsertOAuthUser(
      req.user as OAuthProfileDto,
      req,
    );
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async google(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(@Req() req: Request): Promise<void> {
    return await this.authService.upsertOAuthUser(
      req.user as OAuthProfileDto,
      req,
    );
  }
}
