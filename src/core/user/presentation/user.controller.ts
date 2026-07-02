import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type JwtPayload } from 'src/core/auth/infrastructure/types/jwt-payload.type';
import { UserService } from '../app/user.service';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UserResponseDto } from '../dto/user-response.dto';

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
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch('update-password')
  @ApiOperation({
    summary: 'Оновити пароль користувача',
    description: 'Оновлює пароль поточного користувача',
  })
  @ApiOkResponse({ description: 'Пароль успішно оновлено' })
  @ApiUnauthorizedResponse({ description: 'Невірний пароль або авторизація' })
  async updatePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(user.sub, dto);
  }
}
