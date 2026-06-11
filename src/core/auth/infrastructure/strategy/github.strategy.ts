import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { OAuthProfileDto } from '../../dto/oauth-response.dto';
import { IGithubResponse } from '../types/github.types';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
      customHeaders: { 'User-Agent': 'Reuse-Github-OAuth' },
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: IGithubResponse,
  ): OAuthProfileDto {
    const { id, username, emails, photos } = profile;

    if (!emails?.length) {
      throw new BadRequestException(
        'Помилка авторизації через GitHub: не знайдено електронну адресу користувача.',
      );
    }

    return {
      provider: 'github',
      githubId: id,
      username,
      email: emails[0].value,
      avatarUrl: photos?.[0]?.value ?? null,
    };
  }
}
