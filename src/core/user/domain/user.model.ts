export type UserRole = 'admin' | 'user';
export type UserSource = 'credentials' | 'google' | 'github';

export class UserModel {
  constructor(
    private readonly _id: string,
    private readonly _username: string,
    private readonly _email: string,
    private readonly _role: UserRole,
    private readonly _githubId: string | null = null,
    private readonly _googleId: string | null = null,
    private readonly _createdAt: Date,
    private readonly _avatarUrl: string | null = null,
    private _password: string | null = null,
  ) {}

  get id(): string {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }

  get role(): UserRole {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get avatarUrl(): string | null {
    return this._avatarUrl;
  }

  get password(): string | null {
    return this._password;
  }

  get isAdmin(): boolean {
    return this._role === 'admin';
  }

  get googleId(): string | null {
    return this._googleId;
  }

  get githubId(): string | null {
    return this._githubId;
  }

  changePassword(hashedPassword: string): void {
    this._password = hashedPassword;
  }
}
