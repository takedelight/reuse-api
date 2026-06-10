import { User } from 'src/core/user/domain/user.model';
import { UserResponseDto } from '../../dto/user-response.dto';
import { UserEntity } from '../entity/user.entity';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      createdAt: user.createdAt,
    };
  }

  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.username,
      entity.email,
      entity.role,
      entity.createdAt,
      entity.avatarUrl || null,
      entity.password || null,
    );
  }
}
