import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { type Request, type Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: Request): Promise<void> {
    return await this.authService.register(dto, req);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request): Promise<void> {
    return await this.authService.login(dto, req);
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    return await this.authService.logout(req, res);
  }
}
