import { IPostRepository } from '../../domain/post.repository.interface';
import { PostModel } from '../../domain/post.model';
import { NotFoundException } from '@nestjs/common';
import { UserModel } from 'src/core/user/domain/user.model';

export class InMemoryPostRepository implements IPostRepository {
  private readonly posts: PostModel[] = [];

  createPost(userId: string, post: PostModel): Promise<PostModel> {
    const postWithUser = new PostModel(
      post.id,
      new UserModel(
        userId,
        'test',
        'test@gmail.com',
        'user',
        null,
        null,
        new Date(),
        null,
        null,
      ),
      post.slug ?? '',
      post.isPublished,
      post.title,
      post.content,
      post.createdAt,
      post.updatedAt,
    );

    this.posts.push(postWithUser);
    return Promise.resolve(postWithUser);
  }

  deletePost(postId: string): Promise<void> {
    const postIndex = this.posts.findIndex((post) => post.id === postId);

    if (postIndex === -1) {
      throw new NotFoundException(`Пост з ID ${postId} не знайдено в пам'яті`);
    }

    this.posts.splice(postIndex, 1);

    return Promise.resolve();
  }

  findAll(): Promise<PostModel[]> {
    return Promise.resolve(this.posts);
  }

  findById(postId: string): Promise<PostModel | null> {
    const post = this.posts.find((post) => post.id === postId);

    if (!post) throw new NotFoundException('Post not found');

    return Promise.resolve(post);
  }

  findBySlug(slug: string): Promise<PostModel | null> {
    const post = this.posts.find((post) => post.slug === slug);

    if (!post) throw new NotFoundException('Post not found');

    return Promise.resolve(post);
  }

  async updatePost(post: PostModel): Promise<PostModel> {
    const index = this.posts.findIndex((p) => p.id === post.id);

    if (index === -1) {
      throw new NotFoundException('Post not found');

      this.posts[index] = post;
    }

    return Promise.resolve(this.posts[index]);
  }
}
