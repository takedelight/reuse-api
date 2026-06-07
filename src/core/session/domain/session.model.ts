export class Session {
  private readonly _id: string;
  private readonly _provider: string;
  private readonly _userAgent: string;
  private readonly _userId: string;
  private readonly _createdAt: Date;

  constructor(
    id: string,
    provider: string,
    userAgent: string,
    userId: string,
    createdAt: Date,
  ) {
    this._id = id;
    this._provider = provider;
    this._userAgent = userAgent;
    this._userId = userId;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id;
  }

  get provider(): string {
    return this._provider;
  }

  get userAgent(): string {
    return this._userAgent;
  }

  get userId(): string {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
