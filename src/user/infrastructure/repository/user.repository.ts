import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/domain/user.model';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/user.repository.interface';
import { UserEntity } from '../entity/user.entity';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

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
