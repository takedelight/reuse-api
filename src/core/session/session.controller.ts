import { Controller, Delete, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SessionId } from 'src/common/decorators/session-id.decorator';
import { SessionResponseDto } from './dto/session-response.dto';
import { SessionService } from './session.service';

@ApiTags('Сесії користувачів')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get(':userId')
  @ApiOperation({
    summary: 'Отримати всі сесії  користувача за id',
    description:
      'Повертає список усіх активних сесій для вказаного по ID користувача.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'ID користувача, сесії якого потрібно знайти',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Список сесій успішно отримано',
    type: SessionResponseDto,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Користувача з таким ID не знайдено' })
  getAllUserSessions(@Param('userId') userId: string) {
    return this.sessionService.getAllSessions(userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Отримати всі сесії  користувача',
    description: 'Повертає список усіх активних сесій  користувача.',
  })
  @ApiOkResponse({
    description: 'Список сесій успішно отримано',
    type: SessionResponseDto,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Користувача з таким ID не знайдено' })
  getAllSessions(@CurrentUser() userId: string) {
    return this.sessionService.getAllSessions(userId);
  }

  @Delete('others')
  @ApiOperation({
    summary: 'Завершити всі інші сесії',
    description:
      'Видаляє всі активні сесії поточного користувача, окрім тієї, з якої робиться запит .',
  })
  @ApiOkResponse({
    description: 'Всі інші сесії успішно завершено',
    type: Boolean,
  })
  @ApiUnauthorizedResponse({
    description: 'Користувач не авторизований або сесія недійсна',
  })
  deleteOtherSessions(
    @CurrentUser() userId: string,
    @SessionId() currentSessionId: string,
  ) {
    return this.sessionService.deleteOtherSessions(userId, currentSessionId);
  }
}
