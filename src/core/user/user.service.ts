import {
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

  async createUser(user: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.getUserByEmail(user.email);

    if (existingUser)
      throw new ConflictException(`Користувач з email ${user.email} вже існує`);

    const passwordHash = user.password && (await hash(user.password));

    const createdUser = await this.userRepository.createUser({
      ...user,
      password: passwordHash,
    });

    return UserMapper.toResponse(createdUser);
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.getUserById(userId);

    if (!existingUser) {
      throw new NotFoundException(`Користувач з id ${userId} не знайдений`);
    }

    const updatePayload: Partial<User> = { ...dto };

    if (dto.password) {
      updatePayload.password = await hash(dto.password);
    }

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
