import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Невірний формат електронної пошти' })
  @ApiProperty()
  email: string;

  @IsString({ message: "Пароль є обов'язковим полем" })
  @ApiProperty()
  password: string;

  @IsBoolean()
  @IsOptional()
  isRememberMe?: boolean;
}
