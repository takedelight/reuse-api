import { UserResponseDto } from '../../user/dto/user-response.dto';

export class PostResponseDto {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: Date;
  user: UserResponseDto;
  updatedAt: Date;
}
