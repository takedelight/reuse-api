export class PostModel {
  private readonly _id: string;
  private readonly _slug: string;
  private readonly _isPublished: boolean;
  private readonly _title: string;
  private readonly _content: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(
    id: string,
    slug: string,
    isPublished: boolean,
    title: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._slug = slug;
    this._isPublished = isPublished;
    this._title = title;
    this._content = content;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get slug(): string {
    return this._slug;
  }

  get isPublished(): boolean {
    return this._isPublished;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
