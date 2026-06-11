import { Post } from '@prisma/client';
import { PostModel } from '../../domain/post.model';

export class PostMapper {
  static toDomain(post: Post): PostModel {
    return new PostModel(
      post.slug,
      post.title,
      post.content,
      post.createdAt,
      post.updatedAt,
    );
  }
}
