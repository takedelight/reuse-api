export type UserDeviceType =
  | 'desktop'
  | 'mobile'
  | 'tablet'
  | 'console'
  | 'smarttv'
  | 'wearable'
  | 'embedded'
  | 'xr'
  | 'unknown';

export interface IUserAgentInfo {
  browser: string;
  os: string;
  deviceType: UserDeviceType;
}

export interface IUserAgentParserRepository {
  parse(userAgent: string): IUserAgentInfo;
}

export const USER_AGENT_PARSER_TOKEN = Symbol('IUserAgentParserRepository');
