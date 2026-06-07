import { IsEmail, IsIn, IsOptional, IsString, IsUrl } from 'class-validator';
import { type UserSource } from '../domain/user.model';

export class CreateUserDto {
  @IsString({ message: "Ім'я є обов'язковим" })
  username: string;

  @IsEmail(
    { host_blacklist: ['example.com', 'mail.ru'] },
    { message: 'Введіть коректний email' },
  )
  email: string;

  @IsOptional()
  @IsIn(['credentials', 'google', 'github'], {
    message: 'Некоректне джерело реєстрації користувача',
  })
  provider?: UserSource;

  @IsUrl({}, { message: 'Посилання на аватар має бути валідною URL-адресою' })
  @IsOptional()
  avatarUrl?: string;

  @IsString({ message: 'Пароль має бути рядком' })
  @IsOptional()
  password?: string;
}
