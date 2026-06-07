import { Controller, Delete, Get, Param } from '@nestjs/common';
import { SessionId } from 'src/common/decorators/session-id.decorator';
import { UserId } from 'src/common/decorators/user-id.decorator';
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
    @UserId() userId: string,
    @SessionId() currentSessionId: string,
  ) {
    return this.sessionService.deleteOtherSessions(userId, currentSessionId);
  }
}
