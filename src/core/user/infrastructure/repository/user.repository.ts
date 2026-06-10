import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthProfileDto } from 'src/core/auth/dto/oauth-response.dto';
import { Repository } from 'typeorm';
import { User } from '../../domain/user.model';
import { IUserRepository } from '../../domain/user.repository.interface';
import { UserEntity } from '../entity/user.entity';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async upsertOAuthUser(profile: OAuthProfileDto): Promise<User> {
    let user: UserEntity | null = null;

    if (profile.provider === 'github') {
      user = await this.userRepo.findOneBy({
        githubId: profile.githubId,
      });
    }

    if (profile.provider === 'google') {
      user = await this.userRepo.findOneBy({
        googleId: profile.googleId,
      });
    }

    if (!user) {
      user = await this.userRepo.findOneBy({
        email: profile.email,
      });
    }

    if (user) {
      user.username = profile.username;
      user.avatarUrl = profile.avatarUrl;

      if (profile.provider === 'github') {
        user.githubId = profile.githubId ?? null;
      }

      if (profile.provider === 'google') {
        user.googleId = profile.googleId ?? null;
      }

      await this.userRepo.save(user);

      return UserMapper.toDomain(user);
    }

    const createdUser = this.userRepo.create({
      email: profile.email,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      githubId: profile.provider === 'github' ? profile.githubId : null,
      googleId: profile.provider === 'google' ? profile.googleId : null,
    });

    return UserMapper.toDomain(await this.userRepo.save(createdUser));
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepo.find();
    return users.map((user) => UserMapper.toDomain(user));
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const newEntity = this.userRepo.create(userData);
    const savedEntity = await this.userRepo.save(newEntity);

    return UserMapper.toDomain(savedEntity);
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    await this.userRepo.update(userId, updateData);

    const updatedUser = await this.getUserById(userId);

    if (!updatedUser) {
      throw new Error(
        'Під час оновлення користувача виникла помилка. Користувача не знайдено.',
      );
    }

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepo.delete(userId);
  }
}
