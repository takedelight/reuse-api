import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { type UserSource } from '../domain/user.model';

export class CreateUserDto {
  @ApiProperty({ type: String, minLength: 4 })
  @IsString({ message: "Ім'я є обов'язковим" })
  @MinLength(4, { message: "Ім'я має бути не менше 4 символів" })
  username: string;

  @IsEmail(
    { host_blacklist: ['example.com', 'mail.ru'] },
    { message: 'Введіть коректний email' },
  )
  @ApiProperty({ type: String, format: 'email' })
  email: string;

  @IsOptional()
  @IsIn(['credentials', 'google', 'github'], {
    message: 'Некоректне джерело реєстрації користувача',
  })
  @ApiProperty({
    enumName: 'UserSource',
    enum: ['credentials', 'google', 'github'],
  })
  provider?: UserSource;

  @IsUrl({}, { message: 'Посилання на аватар має бути валідною URL-адресою' })
  @IsOptional()
  @ApiProperty({ required: false, type: String, format: 'url' })
  avatarUrl?: string;

  @IsString({ message: 'Пароль має бути рядком' })
  @IsOptional()
  @ApiProperty({ required: false, type: String, minLength: 6 })
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  password?: string;
}
