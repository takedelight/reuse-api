import { Inject, Injectable } from '@nestjs/common';
import {
  type IPostRepository,
  POST_REPOSITORY_TOKEN,
} from './domain/post.repository.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { PostMapper } from './infrastructure/mapper/post.mapper';
import { UpdatePostDto } from './dto/update-post.dto';

import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_REPOSITORY_TOKEN)
    private readonly postRepository: IPostRepository,
  ) {}

  async findAll() {
    const posts = await this.postRepository.findAll();

    return posts.map((post) => PostMapper.toResponse(post));
  }

  async findById(postId: string) {
    return await this.postRepository.findById(postId);
  }

  async findBySlug(slug: string) {
    return await this.postRepository.findBySlug(slug);
  }

  async create(userId: string, dto: CreatePostDto) {
    const postId = uuidv7();

    const post = PostMapper.toDomainFromDto(postId, dto);

    await this.postRepository.createPost(userId, post);
  }

  async update(postId: string, dto: UpdatePostDto) {
    const post = PostMapper.toDomainFromDto(postId, dto);

    await this.postRepository.updatePost(post);
  }

  async delete(postId: string) {
    return await this.postRepository.deletePost(postId);
  }
}
