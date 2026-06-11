import { Injectable } from '@nestjs/common';
import { OAuthProfileDto } from 'src/core/auth/dto/oauth-response.dto';
import { UserModel } from '../../domain/user.model';
import { IUserRepository } from '../../domain/user.repository.interface';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private readonly users: UserModel[] = [];

  upsertOAuthUser(profile: OAuthProfileDto): Promise<UserModel> {
    let user: UserModel | undefined;

    if (profile.provider === 'github' && profile.githubId) {
      user = this.users.find((u) => u.githubId === profile.githubId);
    }

    if (profile.provider === 'google' && profile.googleId) {
      user = this.users.find((u) => u.googleId === profile.googleId);
    }

    if (!user) {
      user = this.users.find((u) => u.email === profile.email);
    }

    if (user) {
      const updatedUser = new UserModel(
        user.id,
        profile.username,
        user.email,
        user.role,
        profile.provider === 'github'
          ? (profile.githubId ?? user.githubId)
          : user.githubId,
        profile.provider === 'google'
          ? (profile.googleId ?? user.googleId)
          : user.googleId,
        user.createdAt,
        profile.avatarUrl ?? user.avatarUrl,
        user.password,
      );

      const index = this.users.findIndex((u) => u.id === user.id);
      this.users[index] = updatedUser;

      return Promise.resolve(updatedUser);
    }

    const newUser = new UserModel(
      crypto.randomUUID(),
      profile.username,
      profile.email,
      'user',
      profile.provider === 'github' ? profile.githubId : undefined,
      profile.provider === 'google' ? profile.googleId : undefined,
      new Date(),
      profile.avatarUrl ?? null,
      null,
    );

    this.users.push(newUser);

    return Promise.resolve(newUser);
  }

  getAllUsers(): Promise<UserModel[]> {
    return Promise.resolve(this.users.map((user) => UserMapper.toDomain(user)));
  }

  getUserById(id: string): Promise<UserModel | null> {
    const user = this.users.find((u) => u.id === id);
    return Promise.resolve(user ? UserMapper.toDomain(user) : null);
  }

  getUserByEmail(email: string): Promise<UserModel | null> {
    const user = this.users.find((u) => u.email === email);
    return Promise.resolve(user ? UserMapper.toDomain(user) : null);
  }

  async createUser(userData: Partial<UserModel>): Promise<UserModel> {
    const newUser = new UserModel(
      userData.id ?? crypto.randomUUID(),
      userData.username!,
      userData.email!,
      userData.role ?? 'user',
      userData.githubId,
      userData.googleId,
      new Date(),
      userData.avatarUrl ?? null,
      userData.password ?? null,
    );

    this.users.push(newUser);

    return Promise.resolve(newUser);
  }

  updateUser(
    userId: string,
    updateData: Partial<UserModel>,
  ): Promise<UserModel> {
    const user = this.users.find((u) => u.id === userId);

    if (!user) {
      throw new Error(
        'Під час оновлення користувача виникла помилка. Користувача не знайдено.',
      );
    }

    const updatedUser = new UserModel(
      user.id,
      updateData.username ?? user.username,
      updateData.email ?? user.email,
      updateData.role ?? user.role,
      user.githubId ?? user.githubId,
      user.googleId ?? user.googleId,
      user.createdAt,
      updateData.avatarUrl ?? user.avatarUrl,
      updateData.password ?? user.password,
    );

    const index = this.users.findIndex((u) => u.id === userId);
    this.users[index] = updatedUser;

    return Promise.resolve(updatedUser);
  }

  deleteUser(userId: string): Promise<void> {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    return Promise.resolve();
  }
}
