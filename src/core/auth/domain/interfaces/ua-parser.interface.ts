export const USER_AGENT_PARSER_TOKEN = Symbol('IUserAgentParserRepository');

export interface IUserAgentInfo {
  browser: string;
  os: string;
}

export interface IUserAgentParserRepository {
  parse(userAgent: string): IUserAgentInfo;
}
