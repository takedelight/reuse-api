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
import { UserModel } from '../user/domain/user.model';
import {
  type IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../user/domain/user.repository.interface';
import { LoginDto } from './dto/login.dto';
import { OAuthProfileDto } from './dto/oauth-response.dto';
import { RegisterDto } from './dto/register.dto';
import { UserMapper } from '../user/infrastructure/mapper/user.mapper';
import { v7 as uuidv7 } from 'uuid';

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

    const hashedPassword = dto.password ? await hash(dto.password) : null;

    const id = uuidv7();

    const newUser = UserMapper.toModelFromDto(id, dto, hashedPassword);

    const user = await this.userRepository.createUser(newUser);

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

  async upsertOAuthUser(profile: OAuthProfileDto, req: Request): Promise<void> {
    const id = uuidv7();

    const user = await this.userRepository.upsertOAuthUser(id, profile);

    await this.establishSession(user, req);
  }

  private async establishSession(user: UserModel, req: Request): Promise<void> {
    const userAgentInfo = this.userAgentParser.parse(
      req.headers['user-agent'] || '',
    ).browser;

    req.session.userId = user.id;
    req.session.userAgent = userAgentInfo;
    req.session.role = user.role;

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
