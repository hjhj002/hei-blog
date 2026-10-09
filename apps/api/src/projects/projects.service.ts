import { Injectable, NotFoundException } from '@nestjs/common';
import type { Project } from '@hei-blog/shared';
import type { Project as ProjectModel } from '../../generated/client';
import { PrismaService } from '../prisma/prisma.service';

function serialize(project: ProjectModel): Project {
  return {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { sort: 'asc' }, { createdAt: 'desc' }],
    });
    return projects.map(serialize);
  }

  async findBySlug(slug: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { slug },
    });
    if (!project) {
      throw new NotFoundException('项目不存在');
    }
    return serialize(project);
  }
}
