import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AdminPostsController } from './admin-posts.controller';

@Module({
  controllers: [PostsController, AdminPostsController],
  providers: [PostsService],
})
export class PostsModule {}
