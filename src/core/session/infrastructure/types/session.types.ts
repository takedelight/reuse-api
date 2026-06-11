export interface ISessionCookie {
  originalMaxAge: number;
  expires: string;
  secure: boolean;
  httpOnly: boolean;
  path: string;
}

export interface IParsedSession {
  cookie: ISessionCookie;
  userId: string;
  userAgent: string;
}
