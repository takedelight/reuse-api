import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/core/auth/infrastructure/types/jwt-payload.type';
import { UserService } from '../app/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

import type { Response } from 'express';

@Controller('user')
@ApiTags('Користувач')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Отримати всіх користувачів',
    description: 'Повертає список всіх користувачів',
  })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @ApiUnauthorizedResponse({
    description: 'Сесія застаріла або ви не авторизовані',
  })
  @ApiInternalServerErrorResponse({ description: 'Помилка на стороні сервера' })
  getAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAllUsers();
  }

  @Get('/user')
  @Get()
  @ApiOperation({
    summary: 'Отримати  користувача',
    description: 'Повертає інформацію про конкретного користувача',
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Сесія застаріла або ви не авторизовані',
  })
  @ApiInternalServerErrorResponse({ description: 'Помилка на стороні сервера' })
  getUserById(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    return this.userService.getUserById(user.sub);
  }

  @Patch()
  @ApiOperation({
    summary: 'Оновити профіль поточного користувача',
    description:
      'Оновлює дані авторизованого користувача на основі сесії/куки. Передавати ID в URL не потрібно.',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Обʼєкт з полями, які необхідно змінити',
  })
  @ApiOkResponse({
    description: 'Профіль успішно оновлено',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Помилка валідації вхідних даних',
  })
  @ApiUnauthorizedResponse({
    description: 'Сесія застаріла або ви не авторизовані',
  })
  updateUser(
    @CurrentUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(user.sub, updateUserDto);
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

  @Delete('delete')
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
}
