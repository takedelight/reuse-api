interface SessionModelProps {
  id: string;
  tokenHash: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  device: string | null;
  expiresAt: Date;
  createdAt: Date;
}

export class SessionModel {
  private readonly _id: string;
  private readonly _tokenHash: string;
  private readonly _userId: string;
  private readonly _ipAddress: string | null;
  private readonly _userAgent: string | null;
  private readonly _device: string | null;
  private readonly _createdAt: Date;
  private readonly _expiresAt: Date;

  constructor(props: SessionModelProps) {
    this._id = props.id;
    this._tokenHash = props.tokenHash;
    this._userId = props.userId;
    this._ipAddress = props.ipAddress;
    this._userAgent = props.userAgent;
    this._device = props.device;
    this._createdAt = props.createdAt;
    this._expiresAt = props.expiresAt;
  }

  public get id(): string {
    return this._id;
  }

  public get tokenHash(): string {
    return this._tokenHash;
  }

  public get userId(): string {
    return this._userId;
  }

  public get ipAddress(): string | null {
    return this._ipAddress;
  }

  public get userAgent(): string | null {
    return this._userAgent;
  }

  public get device(): string | null {
    return this._device;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get expiresAt(): Date {
    return this._expiresAt;
  }

  public isExpired(): boolean {
    return new Date() > this._expiresAt;
  }
}
