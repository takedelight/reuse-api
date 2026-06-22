import {
  Controller,
  Get,
  Headers,
  Ip,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { GithubGuard } from 'src/core/auth/infrastructure/guards/github.guard';
import { AuthService } from '../app/auth.service';
import { OAuthProfileDto } from '../dto/oauth-response.dto';
import { REFRESH_TOKEN_EXPIRY_MS } from '../infrastructure/constants/const';
import { GoogleGuard } from '../infrastructure/guards/google.guard';

@Controller('oauth')
@Public()
export class OAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('github')
  @UseGuards(GithubGuard)
  async github(): Promise<void> {}

  @Get('github/callback')
  @UseGuards(GithubGuard)
  async githubCallback(
    @Req() req: Request,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res() res: Response,
  ): Promise<void> {
    const tokens = await this.authService.upsertOAuthUser(
      req.user as OAuthProfileDto,
      userAgent || '',
      ip || null,
    );

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.redirect(this.configService.getOrThrow<string>('CORS_ORIGIN'));
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async google(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(
    @Req() req: Request,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res() res: Response,
  ): Promise<void> {
    const tokens = await this.authService.upsertOAuthUser(
      req.user as OAuthProfileDto,
      userAgent || '',
      ip || null,
    );

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.redirect(this.configService.getOrThrow<string>('CORS_ORIGIN'));
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_EXPIRY_MS,
      path: '/',
    });
  }
}
