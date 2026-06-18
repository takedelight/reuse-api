import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
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
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

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
  getUserById(@CurrentUser() userId: string): Promise<UserResponseDto> {
    return this.userService.getUserById(userId);
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
    @CurrentUser() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Post('upload-url')
  async getUploadUrl(
    @CurrentUser() userId: string,
    @Body() dto: { fileName: string; contentType: string },
  ) {
    return this.userService.generateAvatarUploadUrl(
      userId,
      dto.fileName,
      dto.contentType,
    );
  }

  @Post('confirm')
  async confirmUpload(
    @CurrentUser() userId: string,
    @Body() dto: { key: string },
  ) {
    return this.userService.confirmAvatarUpload(userId, dto.key);
  }

  @Delete('avatar')
  async deleteAvatar(@CurrentUser() userId: string) {
    return this.userService.deleteAvatar(userId);
  }
}
