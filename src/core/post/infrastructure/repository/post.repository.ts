import { IPostRepository } from '../../domain/post.repository.interface';
import { PostModel } from '../../domain/post.model';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { PostMapper } from '../mapper/post.mapper';

export class PostRepository implements IPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PostModel[]> {
    const posts = await this.prisma.post.findMany();

    return posts.map((p) => PostMapper.toDomain(p));
  }

  async findById(postId: string): Promise<PostModel | null> {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    return post ? PostMapper.toDomain(post) : null;
  }

  async findBySlug(slug: string): Promise<PostModel | null> {
    const post = await this.prisma.post.findUnique({ where: { slug: slug } });

    return post ? PostMapper.toDomain(post) : null;
  }

  async createPost(post: PostModel): Promise<PostModel> {
    const createdPost = await this.prisma.post.create({
      data: {
        id: post.id ?? undefined,
        slug: post.slug,
        title: post.title,
        content: post.content,
        isPublished: post.isPublished,
      },
    });

    return PostMapper.toDomain(createdPost);
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
    });

    return PostMapper.toDomain(updatedPost);
  }

  async deletePost(postId: string): Promise<void> {
    await this.prisma.post.deleteMany({
      where: {
        id: postId,
      },
    });
  }
}
