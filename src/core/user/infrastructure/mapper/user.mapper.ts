import { User as PrismaUser } from '@prisma/client';
import { UserModel } from 'src/core/user/domain/models/user.model';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserResponseDto } from '../../dto/user-response.dto';

export class UserMapper {
  static toResponse(user: UserModel): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }

  static toModelFromDto(
    id: string,
    dto: CreateUserDto,
    hashedPassword: string | null = null,
  ): UserModel {
    return new UserModel(
      id,
      dto.username,
      dto.bio,
      dto.email,
      hashedPassword,
      null,
      'user',
      null,
      null,
      new Date(),
    );
  }

  static toDomain(entity: PrismaUser): UserModel {
    return new UserModel(
      entity.id,
      entity.username,
      entity.bio,
      entity.email,
      entity.password,
      entity.avatarUrl,
      entity.role,
      entity.githubId,
      entity.googleId,
      entity.createdAt,
    );
  }
}
