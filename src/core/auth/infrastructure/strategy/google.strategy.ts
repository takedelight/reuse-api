import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { IGoogleResponse } from '../types/google.types';
import { type OAuthProfileDto } from '../../dto/oauth-response.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: IGoogleResponse,
  ): OAuthProfileDto {
    const { id, emails, photos, displayName } = profile;

    if (!emails?.length) {
      throw new BadRequestException(
        'Помилка авторизації через Google: не знайдено електронну адресу користувача.',
      );
    }

    return {
      provider: 'google',
      googleId: id,
      username: displayName,
      email: emails[0].value,
      avatarUrl: photos?.[0]?.value ?? null,
    };
  }
}
