import { User } from 'src/core/user/domain/user.model';
import { UserResponseDto } from '../../dto/user-response.dto';
import { UserEntity } from '../entity/user.entity';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }

  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.username,
      entity.email,
      entity.provider,
      entity.role,
      entity.createdAt,
      entity.avatarUrl,
      entity.password,
    );
  }

  static toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.username = domain.username;
    entity.email = domain.email;
    entity.provider = domain.provider;
    entity.role = domain.role;
    entity.createdAt = domain.createdAt;
    entity.avatarUrl = domain.avatarUrl;
    entity.password = domain.password;
    return entity;
  }
}
