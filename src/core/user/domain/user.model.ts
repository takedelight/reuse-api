export type UserRole = 'admin' | 'user';

export class UserModel {
  private readonly _id: string;

  constructor(
    id: string,
    private readonly _username: string,
    private readonly _bio: string | null,
    private readonly _email: string,
    password: string | null,
    private readonly _avatarUrl: string | null,
    private readonly _role: UserRole,
    private readonly _githubId: string | null,
    private readonly _googleId: string | null,
    private readonly _createdAt: Date,
  ) {
    this._id = id;
    this._password = password;
  }

  private _password: string | null;

  get password(): string | null {
    return this._password;
  }

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

  get bio(): string | null {
    return this._bio;
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
