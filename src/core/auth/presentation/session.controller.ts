import { Controller, Delete, Get, Param } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SessionService } from '../app/session.service';
import { type JwtPayload } from '../infrastructure/types/jwt-payload.type';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async getAllSessions(@CurrentUser() currentUser: JwtPayload) {
    return await this.sessionService.getAllUserSessions(
      currentUser.sub,
      currentUser.sessionId,
    );
  }

  @Delete(':id')
  async deleteSession(@Param('id') sessionId: string) {
    return await this.sessionService.deleteById(sessionId);
  }

  @Delete()
  async deleteExceptCurrent(@CurrentUser() currentUser: JwtPayload) {
    return await this.sessionService.deleteExceptCurrent(
      currentUser.sub,
      currentUser.sessionId,
    );
  }
}
