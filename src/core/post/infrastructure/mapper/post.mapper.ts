import { PostModel } from '../../domain/post.model';
import { CreatePostDto } from '../../dto/create-post.dto';
import { UserMapper } from 'src/core/user/infrastructure/mapper/user.mapper';
import { PostResponseDto } from '../../dto/post-response.dto';
import { Prisma } from '@prisma/client';

export type PostWithUser = Prisma.PostGetPayload<{
  include: { user: true };
}>;

export class PostMapper {
  static toDomainFromEntity(post: PostWithUser): PostModel {
    return new PostModel(
      post.id,
      post.user ? UserMapper.toDomain(post.user) : null,
      post.slug ?? '',
      post.isPublished,
      post.title,
      post.content,
      post.createdAt,
      post.updatedAt,
    );
  }

  static toResponse(post: PostModel): PostResponseDto {
    if (!post.user) {
      throw new Error("User doesn't exist");
    }

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: UserMapper.toResponse(post.user),
    };
  }

  static toDomainFromDto(id: string, dto: CreatePostDto): PostModel {
    if (!dto.title.trim()) {
      throw new Error('Назва нотатки не може бути пустим рядком');
    }

    const finalSlug = dto.slug ?? dto.title.split(' ').join('-').toLowerCase();

    const now = new Date();

    return new PostModel(
      id,
      null,
      finalSlug,
      false,
      dto.title,
      dto.content,
      now,
      now,
    );
  }
}
