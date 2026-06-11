import { PostModel } from './post.model';
import { CreatePostDto } from '../dto/create-post.dto';

export interface IPostRepository {
  findAll: () => Promise<PostModel[]>;
  findById: (postId: string) => Promise<PostModel | null>;
  findBySlug: (slug: string) => Promise<PostModel | null>;

  createPost: (dto: CreatePostDto) => Promise<PostModel>;
  updatePost: (post: PostModel) => Promise<PostModel>;

  deletePost: (postId: string) => Promise<void>;
}
