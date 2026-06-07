import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import {
  type IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../user/domain/user.repository.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    const existingUser = await this.userRepository.getUserByEmail(dto.email);

    if (existingUser)
      throw new ConflictException('Користувач з таким email вже існує');

    const hashedPassword = dto.password && (await hash(dto.password));
    const user = await this.userRepository.createUser({
      ...dto,
      password: hashedPassword,
    });
  }

  async login(dto: LoginDto): Promise<void> {
    const user = await this.userRepository.getUserByEmail(dto.email);

    if (!user || !user.password)
      throw new NotFoundException('Невірний email або пароль.');

    const isPasswordValid = await verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірний email або пароль.');
    }
  }
}
