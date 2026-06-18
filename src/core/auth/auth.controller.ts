import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { type Request, type Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Авторизація')
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Реєстрація нового користувача',
    description: 'Створює новий акаунт у системі.',
  })
  @ApiCreatedResponse({ description: 'Користувача успішно зареєстровано' })
  @ApiBadRequestResponse({
    description: 'Невалідні дані',
  })
  @ApiConflictResponse({
    description: 'Користувач з таким email або username вже існує',
  })
  async register(@Body() dto: RegisterDto, @Req() req: Request): Promise<void> {
    return await this.authService.register(dto, req);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Вхід у систему (Логін)',
    description: 'Перевіряє облікові дані та встановлює сесійну куку.',
  })
  @ApiOkResponse({ description: 'Успішний вхід' })
  @ApiUnauthorizedResponse({ description: 'Невірний логін або пароль' })
  async login(@Body() dto: LoginDto, @Req() req: Request): Promise<void> {
    return await this.authService.login(dto, req);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Вихід із системи (Логаут)',
    description: 'Видаляє активну сесію та очищає куку в браузері.',
  })
  @ApiOkResponse({ description: 'Успішний вихід' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    return await this.authService.logout(req, res);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Отримати інформацію про поточного користувача',
    description: 'Повертає інформацію про авторизованого користувача.',
  })
  @ApiOkResponse({ description: 'Інформація про користувача' })
  @ApiUnauthorizedResponse({ description: 'Користувач не авторизований' })
  async getCurrentUser(@Req() req: Request) {
    return await this.authService.getCurrentUser(req);
  }
}
