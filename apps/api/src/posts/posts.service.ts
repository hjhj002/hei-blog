import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../../generated/client';
import type {
  CreatePostInput,
  PaginatedResult,
  Post as PostDto,
  UpdatePostInput,
} from '@hei-blog/shared';
import { PrismaService } from '../prisma/prisma.service';

const postInclude = {
  tags: true,
} satisfies Prisma.PostInclude;

type PostWithTags = Prisma.PostGetPayload<{ include: typeof postInclude }>;

interface ListOptions {
  page: number;
  pageSize: number;
  q?: string;
  tag?: string;
  published?: boolean;
}

function serializePost(post: PostWithTags): PostDto {
  return {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(options: ListOptions): Promise<PaginatedResult<PostDto>> {
    const { page, pageSize, q, tag, published } = options;
    const where: Prisma.PostWhereInput = {
      ...(typeof published === 'boolean' ? { published } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { content: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(tag ? { tags: { some: { slug: tag } } } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.post.count({ where }),
    ]);

    return { items: items.map(serializePost), total, page, pageSize };
  }

  async findBySlug(slug: string): Promise<PostDto> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: postInclude,
    });
    if (!post || !post.published) {
      throw new NotFoundException('文章不存在');
    }
    return serializePost(post);
  }

  async findById(id: string): Promise<PostDto> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: postInclude,
    });
    if (!post) {
      throw new NotFoundException('文章不存在');
    }
    return serializePost(post);
  }

  async create(dto: CreatePostInput): Promise<PostDto> {
    const { tags, ...data } = dto;
    const post = await this.prisma.post.create({
      data: {
        ...data,
        ...(tags?.length
          ? { tags: { connect: (await this.connectTags(tags)).map((t) => ({ id: t.id })) } }
          : {}),
      },
      include: postInclude,
    });
    return serializePost(post);
  }

  async update(id: string, dto: UpdatePostInput): Promise<PostDto> {
    await this.ensureExists(id);
    const { tags, ...data } = dto;
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        ...(tags
          ? { tags: { set: (await this.connectTags(tags)).map((t) => ({ id: t.id })) } }
          : {}),
      },
      include: postInclude,
    });
    return serializePost(post);
  }

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.post.delete({ where: { id } });
  }

  private async ensureExists(id: string): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!post) {
      throw new NotFoundException('文章不存在');
    }
  }

  private async connectTags(
    names: string[],
  ): Promise<Array<{ id: string }>> {
    const tags: Array<{ id: string }> = [];
    for (const raw of names) {
      const name = raw.trim();
      if (!name) continue;
      const tag = await this.prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name, slug: name },
      });
      tags.push(tag);
    }
    return tags;
  }
}
