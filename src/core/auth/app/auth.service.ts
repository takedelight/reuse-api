import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import * as crypto from 'crypto';
import {
  type IUserRepository,
  USER_REPOSITORY_TOKEN,
} from 'src/core/user/domain/interfaces/user.repository.interface';
import { UserMapper } from 'src/core/user/infrastructure/mapper/user.mapper';
import { v7 as uuidv7 } from 'uuid';
import {
  type ISessionRepository,
  SESSION_REPOSITORY_TOKEN,
} from '../domain/interfaces/session.repository.interface';
import {
  type IUserAgentParserRepository,
  USER_AGENT_PARSER_TOKEN,
} from '../domain/interfaces/ua-parser.interface';
import { SessionModel } from '../domain/model/session.model';
import { LoginDto } from '../dto/login.dto';
import { OAuthProfileDto } from '../dto/oauth-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { REFRESH_TOKEN_EXPIRY_MS } from '../infrastructure/constants/const';
import { UserRoles } from '@prisma/client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(USER_AGENT_PARSER_TOKEN)
    private readonly userAgentParser: IUserAgentParserRepository,
    @Inject(SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepository: ISessionRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
    userAgents: string,
    ip: string | null,
  ): Promise<AuthTokens> {
    const existingUser = await this.userRepository.getUserByEmail(dto.email);

    if (existingUser)
      throw new ConflictException('errors.server.user_already_exists');

    const hashedPassword = dto.password ? await hash(dto.password) : null;
    const id = uuidv7();
    const newUser = UserMapper.toModelFromDto(id, dto, hashedPassword);
    const user = await this.userRepository.createUser(newUser);

    return this.createSessionAndTokens(user.id, user.role, userAgents, ip);
  }

  async login(
    dto: LoginDto,
    userAgents: string,
    ip: string | null,
  ): Promise<AuthTokens> {
    const user = await this.userRepository.getUserByEmail(dto.email);

    if (!user || !user.password)
      throw new NotFoundException('errors.server.user_not_found');

    const isPasswordValid = await verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'errors.server.invalid_credentials_error',
      );
    }

    return this.createSessionAndTokens(user.id, user.role, userAgents, ip);
  }

  async refresh(
    refreshToken: string,
    userAgents: string,
    ip: string | null,
  ): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('errors.server.refresh_token_missing');
    }

    try {
      const payload: { sessionId: string } = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );

      const session = await this.sessionRepository.getById(payload.sessionId);

      if (!session) {
        throw new UnauthorizedException('errors.server.session_not_found');
      }

      if (new Date() > session.expiresAt) {
        await this.sessionRepository.deleteSession(session.id);
        throw new UnauthorizedException('errors.server.session_expired');
      }

      const isTokenValid = this.validaterefreshToken(
        refreshToken,
        session.tokenHash,
      );

      if (!isTokenValid) {
        throw new UnauthorizedException('errors.server.invalid_refresh_token');
      }

      const user = await this.userRepository.getUserById(session.userId);

      if (!user) {
        throw new NotFoundException('errors.server.user_not_found');
      }

      await this.sessionRepository.deleteSession(session.id);

      return this.createSessionAndTokens(user.id, user.role, userAgents, ip);
    } catch {
      throw new UnauthorizedException('errors.server.invalid_refresh_token');
    }
  }

  private validaterefreshToken(token: string, tokenHash: string): boolean {
    const hashedToken = this.hashToken(token);

    return hashedToken === tokenHash;
  }

  async upsertOAuthUser(
    profile: OAuthProfileDto,
    userAgents: string,
    ip: string | null,
  ): Promise<AuthTokens> {
    const id = uuidv7();
    const user = await this.userRepository.upsertOAuthUser(id, profile);

    return this.createSessionAndTokens(user.id, user.role, userAgents, ip);
  }

  private async createSessionAndTokens(
    userId: string,
    role: UserRoles,
    userAgents: string,
    ip: string | null,
  ): Promise<AuthTokens> {
    const userAgentInfo = this.userAgentParser.parse(userAgents || '');
    const sessionId = uuidv7();

    const { accessToken, refreshToken } = await this.generateToken(
      userId,
      sessionId,
      role,
    );

    const sessionModel = new SessionModel({
      id: sessionId,
      tokenHash: this.hashToken(refreshToken),
      userId,
      ipAddress: ip,
      userAgent: userAgentInfo.browser,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
      device: userAgentInfo.os,
    });

    await this.sessionRepository.createSession(sessionModel);

    return { accessToken, refreshToken };
  }

  async logout(sessionId: string): Promise<void> {
    if (sessionId) {
      await this.sessionRepository.deleteSession(sessionId);
    }
  }

  private async generateToken(
    userId: string,
    sessionId: string,
    role: UserRoles,
  ): Promise<AuthTokens> {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, sessionId, role },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sessionId },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: Math.floor(REFRESH_TOKEN_EXPIRY_MS / 1000),
      },
    );

    return { accessToken, refreshToken };
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('errors.server.user_not_found');
    }

    return UserMapper.toResponse(user);
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
