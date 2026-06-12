import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

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

  @IsString({ message: 'Пароль має бути рядком' })
  @IsOptional()
  @ApiProperty({ required: false, type: String, minLength: 6 })
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  password?: string;
}
