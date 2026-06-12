import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @Public()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get('slug/:slug')
  @Public()
  async getBySlug(@Param('slug') slug: string) {
    return await this.postService.findBySlug(slug);
  }

  @Get(':id')
  @Public()
  async getById(@Param('id') id: string) {
    return await this.postService.findById(id);
  }

  @Post()
  async create(@CurrentUser() userId: string, @Body() dto: CreatePostDto) {
    return await this.postService.create(userId, dto);
  }

  @Patch(':postId')
  async update(@Param('postId') postId: string, @Body() dto: UpdatePostDto) {
    return await this.postService.update(postId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.postService.delete(id);
  }
}
