import { Injectable } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import {
  IUserAgentInfo,
  IUserAgentParserRepository,
} from '../../domain/ua-parser.interface';

@Injectable()
export class UserAgentParserRepository implements IUserAgentParserRepository {
  parse(userAgent: string): IUserAgentInfo {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
      browser: result.browser.name || 'Unknown Browser',
      os: result.os.name || 'Unknown OS',
      deviceType: result.device.type || 'desktop',
    };
  }
}
