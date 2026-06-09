export type UserRole = 'admin' | 'user';
export type UserSource = 'credentials' | 'google' | 'github';

export class User {
  constructor(
    private readonly _id: string,
    private readonly _username: string,
    private readonly _email: string,
    private readonly _provider: UserSource,
    private readonly _role: UserRole,
    private readonly _createdAt: Date,
    private readonly _avatarUrl?: string,
    private _password?: string,
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
  get provider(): UserSource {
    return this._provider;
  }
  get role(): UserRole {
    return this._role;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get avatarUrl(): string | undefined {
    return this._avatarUrl;
  }
  get password(): string | undefined {
    return this._password;
  }

  get isAdmin(): boolean {
    return this._role === 'admin';
  }

  changePassword(hashedPassword: string): void {
    if (this._provider !== 'credentials') {
      throw new Error(
        'Користувачам з OAuth заборонено встановлювати локальний пароль.',
      );
    }
    this._password = hashedPassword;
  }
}
