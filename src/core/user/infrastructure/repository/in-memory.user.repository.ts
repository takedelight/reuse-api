import { Injectable } from '@nestjs/common';
import { OAuthProfileDto } from 'src/core/auth/dto/oauth-response.dto';
import { UserModel } from '../../domain/user.model';
import { IUserRepository } from '../../domain/user.repository.interface';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private readonly users: UserModel[] = [];

  upsertOAuthUser(
    userId: string,
    profile: OAuthProfileDto,
  ): Promise<UserModel> {
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
        null,
        user.email,
        user.password,
        profile.avatarUrl ?? user.avatarUrl,
        user.role,
        null,
        null,
        user.createdAt,
      );

      const index = this.users.findIndex((u) => u.id === user.id);
      this.users[index] = updatedUser;

      return Promise.resolve(updatedUser);
    }

    const newUser = new UserModel(
      crypto.randomUUID(),
      profile.username,
      null,
      profile.email,
      null,
      profile.avatarUrl ?? null,
      'user',
      null,
      null,
      new Date(),
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

  async createUser(userData: UserModel): Promise<UserModel> {
    const newUser = new UserModel(
      userData.id ?? crypto.randomUUID(),
      userData.username,
      null,
      userData.email,
      userData.password ?? null,
      userData.avatarUrl ?? null,
      userData.role ?? 'user',
      userData.githubId,
      userData.googleId,
      new Date(),
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
      null,
      updateData.email ?? user.email,
      updateData.password ?? user.password,
      updateData.avatarUrl ?? user.avatarUrl,
      updateData.role ?? user.role,
      user.githubId ?? user.githubId,
      user.googleId ?? user.googleId,
      user.createdAt,
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
