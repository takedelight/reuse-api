import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Невірний формат електронної пошти' })
  email: string;

  @IsString({ message: "Пароль є обов'язковим полем" })
  password: string;
}
