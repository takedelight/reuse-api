export type UserRole = 'admin' | 'user';

export class User {
  id: string;
  username: string;
  avatarUrl?: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;

  changePassword(newPassword: string) {
    this.password = newPassword;
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }
}
