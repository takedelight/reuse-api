import { IsString } from 'class-validator';
import { OAuthProvider } from '../types/auth.type';

export class OAuthLoginDto {
  provider: OAuthProvider;

  @IsString({ message: "Токен є обов'язковим полем" })
  token: string;
}
