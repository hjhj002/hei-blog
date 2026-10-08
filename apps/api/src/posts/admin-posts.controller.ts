import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { PaginatedResult, Post as PostDto } from '@hei-blog/shared';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ListPostsQuery } from './dto/list-posts.query';

@ApiTags('admin/posts')
@Controller('admin/posts')
export class AdminPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: '后台文章列表（含未发布）' })
  list(@Query() query: ListPostsQuery): Promise<PaginatedResult<PostDto>> {
    return this.postsService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '按 ID 查询文章' })
  findOne(@Param('id') id: string): Promise<PostDto> {
    return this.postsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: '新建文章' })
  create(@Body() dto: CreatePostDto): Promise<PostDto> {
    return this.postsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新文章' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ): Promise<PostDto> {
    return this.postsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文章' })
  async remove(@Param('id') id: string): Promise<{ ok: boolean }> {
    await this.postsService.remove(id);
    return { ok: true };
  }
}
