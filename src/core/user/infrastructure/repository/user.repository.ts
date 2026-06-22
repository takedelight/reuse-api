import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { OAuthProfileDto } from 'src/core/auth/dto/oauth-response.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserModel } from '../../domain/models/user.model';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertOAuthUser(
    userId: string,
    profile: OAuthProfileDto,
  ): Promise<UserModel> {
    let user: User | null = null;

    if (profile.provider === 'github') {
      user = await this.prisma.user.findUnique({
        where: {
          githubId: profile.githubId,
        },
      });
    }

    if (profile.provider === 'google') {
      user = await this.prisma.user.findUnique({
        where: {
          googleId: profile.googleId,
        },
      });
    }

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: {
          email: profile.email,
        },
      });
    }

    if (user) {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          username: profile.username,
          avatarUrl: profile.avatarUrl,
          githubId:
            profile.provider === 'github' ? profile.githubId : user.githubId,
          googleId:
            profile.provider === 'google' ? profile.googleId : user.googleId,
        },
      });

      return UserMapper.toDomain(updatedUser);
    }

    const createdUser = await this.prisma.user.create({
      data: {
        id: userId,
        email: profile.email,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        githubId: profile.provider === 'github' ? profile.githubId : null,
        googleId: profile.provider === 'google' ? profile.googleId : null,
      },
    });

    return UserMapper.toDomain(createdUser);
  }

  async getAllUsers(): Promise<UserModel[]> {
    const users = await this.prisma.user.findMany();

    return users.map((u) => UserMapper.toDomain(u));
  }

  async getUserById(userId: string): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async getUserByEmail(email: string): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async createUser(userData: UserModel): Promise<UserModel> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        password: userData.password ?? null,
        avatarUrl: userData.avatarUrl ?? null,
        githubId: null,
        googleId: null,
      },
    });

    return UserMapper.toDomain(createdUser);
  }

  async updateUser(
    userId: string,
    updateData: Partial<UserModel>,
  ): Promise<UserModel> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: updateData.username,
        email: updateData.email,
        bio: updateData.bio,
        password: updateData.password,
        avatarUrl: updateData.avatarUrl,
        role: updateData.role,
      },
    });

    return UserMapper.toDomain(updatedUser);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
