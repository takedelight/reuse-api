import { Injectable } from '@nestjs/common';
import { OAuthProfileDto } from 'src/core/auth/dto/oauth-response.dto';
import { User } from '../../domain/user.model';
import { IUserRepository } from '../../domain/user.repository.interface';
import { UserEntity } from '../entity/user.entity';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  upsertOAuthUser(profile: OAuthProfileDto): Promise<User> {
    throw new Error('Method not implemented.');
  }
  private readonly users: UserEntity[] = [];

  getAllUsers(): Promise<User[]> {
    return Promise.resolve(this.users.map((user) => UserMapper.toDomain(user)));
  }

  getUserById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return Promise.resolve(user ? UserMapper.toDomain(user) : null);
  }

  getUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return Promise.resolve(user ? UserMapper.toDomain(user) : null);
  }

  createUser(userData: Partial<User>): Promise<User> {
    const newEntity = new UserEntity();

    newEntity.id = userData.id || crypto.randomUUID();
    newEntity.username = userData.username!;
    newEntity.email = userData.email!;
    newEntity.password = userData.password!;
    newEntity.role = userData.role || 'user';
    newEntity.avatarUrl = userData.avatarUrl || '';
    newEntity.createdAt = new Date();

    this.users.push(newEntity);

    return Promise.resolve(UserMapper.toDomain(newEntity));
  }

  updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const index = this.users.findIndex((u) => u.id === userId);

    if (index === -1) {
      throw new Error(
        'Під час оновлення користувача виникла помилка. Користувача не знайдено.',
      );
    }

    Object.assign(this.users[index], updateData);

    return Promise.resolve(UserMapper.toDomain(this.users[index]));
  }

  deleteUser(userId: string): Promise<void> {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    return Promise.resolve();
  }
}
