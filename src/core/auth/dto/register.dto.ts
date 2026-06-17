import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUserDto } from 'src/core/user/dto/create-user.dto';

export class RegisterDto extends CreateUserDto {
  @IsBoolean()
  @IsOptional()
  isRememberMe?: boolean;
}
