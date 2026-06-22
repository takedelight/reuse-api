import { Controller } from '@nestjs/common';
import { SessionService } from '../app/session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
}
