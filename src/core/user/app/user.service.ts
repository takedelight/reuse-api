import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { S3StorageService } from 'src/infrastructure/storage/s3-storage.service';
import { UserModel } from '../domain/user.model';
import {
  type IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../domain/user.repository.interface';
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
    const existingUser = await this.userRepository.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException(`Користувач з id ${userId} не існує`);
    }

    const hashedPassword = dto.password ? await hash(dto.password) : undefined;

    const updatePayload: Partial<UserModel> = {
      ...dto,
      ...(hashedPassword && { password: hashedPassword }),
    };

    const updatedUser = await this.userRepository.updateUser(
      userId,
      updatePayload,
    );

    return UserMapper.toResponse(updatedUser);
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

    await this.userRepository.updateUser(userId, { avatarUrl });
  }

  async deleteAvatar(userId: string) {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`Користувач з id ${userId} не існує`);
    }

    await this.userRepository.updateUser(userId, { avatarUrl: null });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.deleteUser(userId);
  }
}
