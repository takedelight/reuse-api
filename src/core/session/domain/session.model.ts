export class SessionModel {
  private readonly _id: string;
  private readonly _userAgent: string;
  private readonly _userId: string;
  private readonly _expires: string;

  constructor(id: string, userAgent: string, userId: string, expires: string) {
    this._id = id;
    this._userAgent = userAgent;
    this._userId = userId;
    this._expires = expires;
  }

  get id(): string {
    return this._id;
  }

  get userAgent(): string {
    return this._userAgent;
  }

  get userId(): string {
    return this._userId;
  }

  get expires(): string {
    return this._expires;
  }
}
