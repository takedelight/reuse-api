import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAllUsers();
  }

  @Get('/user')
  getUserById(@CurrentUser() userId: string): Promise<UserResponseDto> {
    return this.userService.getUserById(userId);
  }

  @Patch()
  updateUser(
    @CurrentUser() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(userId, updateUserDto);
  }
}
