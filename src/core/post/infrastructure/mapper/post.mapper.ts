import { Post as PrismaPost } from '@prisma/client';
import { PostModel } from '../../domain/post.model';
import { CreatePostDto } from '../../dto/create-post.dto';

export class PostMapper {
  static toDomain(post: PrismaPost): PostModel {
    return new PostModel(
      post.id,
      post.slug ?? '',
      post.isPublished,
      post.title,
      post.content,
      post.createdAt,
      post.updatedAt,
    );
  }

  static toDomainFromDto(id: string, dto: CreatePostDto): PostModel {
    if (!dto.title.trim()) {
      throw new Error('Назва нотатки не може бути пустим рядком');
    }

    const finalSlug = dto.slug ?? dto.title.split(' ').join('-').toLowerCase();

    const now = new Date();

    return new PostModel(
      id,
      finalSlug,
      false,
      dto.title,
      dto.content,
      now,
      now,
    );
  }
}
