import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ type: String, format: 'uuid' })
  id: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String, format: 'url' })
  avatarUrl?: string;

  @ApiProperty({ type: String, format: 'email' })
  email: string;

  @ApiProperty({ type: Date, format: 'date-time' })
  createdAt: Date;
}
