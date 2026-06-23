import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { S3StorageService } from 'src/infrastructure/storage/s3-storage.service';
import {
  type IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../domain/interfaces/user.repository.interface';
import { UserModel } from '../domain/models/user.model';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserMapper } from '../infrastructure/mapper/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly storageService: S3StorageService,
  ) {}

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.getAllUsers();

    return users.map((user) => UserMapper.toResponse(user));
  }

  async getUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`Користувач з id ${userId} не існує`);
    }

    return UserMapper.toResponse(user);
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`Користувач з id ${email} не існує`);
    }

    return UserMapper.toResponse(user);
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const hashedPassword = dto.password
        ? await hash(dto.password)
        : undefined;

      const updatePayload: Partial<UserModel> = {
        ...dto,
        ...(hashedPassword && { password: hashedPassword }),
      };

      const updatedUser = await this.userRepository.updateUser(
        userId,
        updatePayload,
      );

      return UserMapper.toResponse(updatedUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`errors.server.user_not_found`);
        }

        if (error.code === 'P2002') {
          throw new ConflictException(`errors.server.user_already_exists`);
        }
      }

      throw error;
    }
  }
  async generateAvatarUploadUrl(
    userId: string,
    fileName: string,
    contentType: string,
  ) {
    const folder = `avatars/${userId}`;
    return this.storageService.getUploadUrl(folder, fileName, contentType);
  }

  async confirmAvatarUpload(userId: string, key: string) {
    const avatarUrl = await this.storageService.getDownloadUrl(key);

    const updatedUser = await this.userRepository.updateUser(userId, {
      avatarUrl,
    });

    return UserMapper.toResponse(updatedUser);
  }

  async deleteAvatar(userId: string) {
    const updatedUser = await this.userRepository.updateUser(userId, {
      avatarUrl: null,
    });

    return UserMapper.toResponse(updatedUser);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.deleteUser(userId);
  }
}
