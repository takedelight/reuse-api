import { Module } from '@nestjs/common';
import { POST_REPOSITORY_TOKEN } from './domain/post.repository.interface';
import { PostRepository } from './infrastructure/repository/post.repository';
import { PostService } from './post.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { PostController } from './post.controller';

@Module({
  controllers: [PostController],
  providers: [
    {
      provide: POST_REPOSITORY_TOKEN,
      useClass: PostRepository,
    },
    PostService,
    PrismaService,
  ],
})
export class PostModule {}
