import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { PaginatedResult, Post as PostDto } from '@hei-blog/shared';
import { PostsService } from './posts.service';
import { ListPostsQuery } from './dto/list-posts.query';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: '公开文章列表（仅已发布）' })
  list(@Query() query: ListPostsQuery): Promise<PaginatedResult<PostDto>> {
    return this.postsService.list({ ...query, published: true });
  }

  @Get(':slug')
  @ApiOperation({ summary: '公开文章详情' })
  findBySlug(@Param('slug') slug: string): Promise<PostDto> {
    return this.postsService.findBySlug(slug);
  }
}
