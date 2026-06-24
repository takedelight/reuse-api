import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/core/auth/infrastructure/types/jwt-payload.type';
import { UserService } from '../app/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUserById(@CurrentUser() user: JwtPayload) {
    return this.userService.getUserById(user.sub);
  }

  @Patch()
  updateUser(
    @CurrentUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(user.sub, updateUserDto);
  }

  @Delete()
  async deleteProfile(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.userService.deleteUser(user.sub);

    this.clearAuthCookies(res);
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }

  @Post('upload-url')
  async getUploadUrl(
    @CurrentUser() user: JwtPayload,
    @Body() dto: { fileName: string; contentType: string },
  ) {
    return this.userService.generateAvatarUploadUrl(
      user.sub,
      dto.fileName,
      dto.contentType,
    );
  }

  @Post('confirm')
  async confirmUpload(
    @CurrentUser() user: JwtPayload,
    @Body() dto: { key: string },
  ) {
    return this.userService.confirmAvatarUpload(user.sub, dto.key);
  }

  @Delete('avatar')
  async deleteAvatar(@CurrentUser() user: JwtPayload) {
    return this.userService.deleteAvatar(user.sub);
  }
}
