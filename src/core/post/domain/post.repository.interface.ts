import { PostModel } from './post.model';

export const POST_REPOSITORY_TOKEN = Symbol('IPostRepository');

export interface IPostRepository {
  findAll: () => Promise<PostModel[]>;
  findById: (postId: string) => Promise<PostModel | null>;
  findBySlug: (slug: string) => Promise<PostModel | null>;

  createPost: (userId: string, dto: PostModel) => Promise<PostModel>;
  updatePost: (post: PostModel) => Promise<PostModel>;

  deletePost: (postId: string) => Promise<void>;
}
