import { IPostRepository } from '../../domain/post.repository.interface';
import { PostModel } from '../../domain/post.model';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { PostMapper } from '../mapper/post.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PostModel[]> {
    const posts = await this.prisma.post.findMany({
      include: {
        user: true,
      },
    });

    return posts.map((p) => PostMapper.toDomainFromEntity(p));
  }

  async findById(postId: string): Promise<PostModel | null> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { user: true },
    });

    return post ? PostMapper.toDomainFromEntity(post) : null;
  }

  async findBySlug(slug: string): Promise<PostModel | null> {
    const post = await this.prisma.post.findUnique({
      where: { slug: slug },
      include: { user: true },
    });

    return post ? PostMapper.toDomainFromEntity(post) : null;
  }

  async createPost(userId: string, post: PostModel): Promise<PostModel> {
    const createdPost = await this.prisma.post.create({
      data: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        isPublished: post.isPublished,
        userId: userId,
      },
      include: {
        user: true,
      },
    });

    return PostMapper.toDomainFromEntity(createdPost);
  }

  async updatePost(post: PostModel): Promise<PostModel> {
    const updatedPost = await this.prisma.post.update({
      where: { id: post.id },
      data: {
        slug: post.slug,
        title: post.title,
        content: post.content,
        isPublished: post.isPublished,
      },
      include: {
        user: true,
      },
    });

    return PostMapper.toDomainFromEntity(updatedPost);
  }

  async deletePost(postId: string): Promise<void> {
    await this.prisma.post.deleteMany({
      where: {
        id: postId,
      },
    });
  }
}
