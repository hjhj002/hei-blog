import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Project } from '@hei-blog/shared';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: '项目列表' })
  list(): Promise<Project[]> {
    return this.projectsService.list();
  }

  @Get(':slug')
  @ApiOperation({ summary: '项目详情' })
  findOne(@Param('slug') slug: string): Promise<Project> {
    return this.projectsService.findBySlug(slug);
  }
}
