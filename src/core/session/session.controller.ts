import { Controller, Delete, Get, Param } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SessionId } from 'src/common/decorators/session-id.decorator';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get(':userId')
  getAllUserSessions(@Param('userId') userId: string) {
    return this.sessionService.getAllSessions(userId);
  }

  @Delete('others')
  deleteOtherSessions(
    @CurrentUser() userId: string,
    @SessionId() currentSessionId: string,
  ) {
    return this.sessionService.deleteOtherSessions(userId, currentSessionId);
  }
}
