import { UserRoles } from '@prisma/client';

export class UserModel {
  private readonly _id: string;

  constructor(
    id: string,
    private readonly _username: string,
    private readonly _bio: string | null,
    private readonly _email: string,
    private _password: string | null,
    private _avatarUrl: string | null,
    private readonly _role: UserRoles,
    private readonly _githubId: string | null,
    private readonly _googleId: string | null,
    private readonly _createdAt: Date,
  ) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get bio(): string | null {
    return this._bio;
  }

  get email(): string {
    return this._email;
  }

  get password(): string | null {
    return this._password;
  }

  get avatarUrl(): string | null {
    return this._avatarUrl;
  }

  get role(): UserRoles {
    return this._role;
  }

  get googleId(): string | null {
    return this._googleId;
  }

  get githubId(): string | null {
    return this._githubId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get isAdmin(): boolean {
    return this._role === 'admin';
  }

  changePassword(hashedPassword: string): void {
    this._password = hashedPassword;
  }

  removeAvatar(): void {
    this._avatarUrl = null;
  }

  updateAvatar(newAvatarUrl: string): void {
    this._avatarUrl = newAvatarUrl;
  }
}
