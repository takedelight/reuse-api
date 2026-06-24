import { Controller, Get } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from '../app/user.service';
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
  getAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAllUsers();
  }
}
