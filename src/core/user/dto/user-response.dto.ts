import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ type: String, format: 'uuid' })
  id: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String, format: 'url' })
  avatarUrl: string | null;

  @ApiProperty({ type: String, format: 'email' })
  email: string;

  bio: string | null;

  role: UserRoles;

  @ApiProperty({ type: Date, format: 'date-time' })
  createdAt: Date;
}
