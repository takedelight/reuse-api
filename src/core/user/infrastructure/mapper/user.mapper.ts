import { User } from 'src/core/user/domain/user.model';
import { UserResponseDto } from '../../dto/user-response.dto';
import { UserEntity } from '../entity/user.entity';

export class UserMapper {
  static toResponse(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }

  static toDomain(entity: UserEntity): User {
    const user = new User();

    user.id = entity.id;
    user.username = entity.username;
    user.email = entity.email;
    user.avatarUrl = entity.avatarUrl;
    user.password = entity.password;
    user.role = entity.role;
    user.createdAt = entity.createdAt;

    return user;
  }
}
