import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Назва нотатки має бути рядком' })
  @IsNotEmpty({ message: 'Назва нотатки не може бути пустою.' })
  @MinLength(3, { message: 'Назва нотатки має містити мінімум 3 символи' })
  title: string;

  @IsString({ message: 'Slug має бути рядком' })
  @IsNotEmpty({ message: 'Slug не може бути пустим' })
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug може містити лише маленькі латинські літери, цифри та дефіси (наприклад: my-new-post)',
  })
  slug: string | null;

  @IsString({ message: 'Контент нотатки має бути рядком' })
  @IsNotEmpty({ message: 'Контент нотатки не може бути пустим.' })
  content: string;
}
