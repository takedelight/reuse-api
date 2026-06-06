import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: "Ім'я є обов'язковим" })
  username: string;

  @IsEmail(
    { host_blacklist: ['example.com', 'mail.ru'] },
    { message: "Email є обов'язковим" },
  )
  email: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
