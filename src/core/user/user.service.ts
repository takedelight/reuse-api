import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';
import { User } from './domain/user.model';
import {
  USER_REPOSITORY_TOKEN,
  type IUserRepository,
} from './domain/user.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserMapper } from './infrastructure/mapper/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
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

  async createUser(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.getUserByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    const source = dto.provider ?? 'credentials';
    let hashedPassword: string | undefined;

    if (source === 'credentials') {
      if (!dto.password) {
        throw new BadRequestException(
          'Пароль є обов’язковим для цього типу реєстрації',
        );
      }
      hashedPassword = await hash(dto.password);
    }

    return this.userRepository.createUser({
      ...dto,
      provider: source,
      password: hashedPassword,
    });
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

    const updatePayload: Partial<User> = {
      ...dto,
      ...(hashedPassword && { password: hashedPassword }),
    };

    const updatedUser = await this.userRepository.updateUser(
      userId,
      updatePayload,
    );

    return UserMapper.toResponse(updatedUser);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.deleteUser(userId);
  }
}
