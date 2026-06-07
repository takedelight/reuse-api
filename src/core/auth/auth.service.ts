import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';
import { type Request, type Response } from 'express';
import {
  type IUserAgentParserRepository,
  USER_AGENT_PARSER_TOKEN,
} from '../session/domain/ua-parser.interface';
import { User } from '../user/domain/user.model';
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
    @Inject(USER_AGENT_PARSER_TOKEN)
    private readonly userAgentParser: IUserAgentParserRepository,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto, req: Request): Promise<void> {
    const existingUser = await this.userRepository.getUserByEmail(dto.email);

    if (existingUser)
      throw new ConflictException('Користувач з таким email вже існує');

    const hashedPassword = dto.password && (await hash(dto.password));

    const user = await this.userRepository.createUser({
      ...dto,
      password: hashedPassword,
      provider: 'credentials',
    });

    await this.establishSession(user, req);
  }

  async login(dto: LoginDto, req: Request): Promise<void> {
    const user = await this.userRepository.getUserByEmail(dto.email);

    if (!user || !user.password)
      throw new NotFoundException('Невірний email або пароль.');

    const isPasswordValid = await verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірний email або пароль.');
    }

    await this.establishSession(user, req);
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie(this.configService.getOrThrow('SESSION_NAME'), {
      path: '/',
    });

    return new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err instanceof Error) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private async establishSession(user: User, req: Request): Promise<void> {
    const userAgentInfo = this.userAgentParser.parse(
      req.headers['user-agent'] || '',
    ).browser;

    req.session.userId = user.id;
    req.session.provider = user.provider || 'credentials';
    req.session.userAgent = userAgentInfo;

    return new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err instanceof Error) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
