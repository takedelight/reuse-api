export class OAuthProfileDto {
  provider: 'github' | 'google';

  email: string | null;

  username: string;

  avatarUrl: string | null;

  githubId?: string;

  googleId?: string;
}
