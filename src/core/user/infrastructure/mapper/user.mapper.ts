import { UserModel } from 'src/core/user/domain/user.model';
import { UserResponseDto } from '../../dto/user-response.dto';

import { Users } from '@prisma/client';

export class UserMapper {
  static toResponse(user: UserModel): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      createdAt: user.createdAt,
    };
  }

  static toDomain(entity: Users): UserModel {
    return new UserModel(
      entity.id,
      entity.username,
      entity.email,
      entity.role,
      entity.githubId,
      entity.googleId,
      entity.createdAt,
      entity.avatarUrl,
      entity.password,
    );
  }
}
