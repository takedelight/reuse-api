export class OAuthProfileDto {
  provider: 'github' | 'google';

  email: string;

  username: string;

  avatarUrl: string | null;

  githubId?: string;

  googleId?: string;
}
