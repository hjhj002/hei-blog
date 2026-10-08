import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Tag as TagDto } from '@hei-blog/shared';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: '标签列表' })
  list(): Promise<TagDto[]> {
    return this.tagsService.list();
  }
}
