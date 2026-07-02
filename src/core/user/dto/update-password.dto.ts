import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsOptional()
  @IsString({ message: 'currentPassword повинно бути рядком' })
  @MinLength(8, { message: 'Пароль має бути не менше 8 символів' })
  currentPassword?: string;

  @IsNotEmpty({ message: 'newPassword не може бути порожнім' })
  @IsString({ message: 'newPassword повинно бути рядком' })
  @MinLength(8, { message: 'Пароль має бути не менше 8 символів' })
  newPassword: string;
}
