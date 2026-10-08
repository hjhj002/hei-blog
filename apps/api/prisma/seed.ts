import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.tag.upsert({
    where: { slug: 'nestjs' },
    update: {},
    create: { name: 'NestJS', slug: 'nestjs' },
  });
  await prisma.tag.upsert({
    where: { slug: 'react' },
    update: {},
    create: { name: 'React', slug: 'react' },
  });
  await prisma.tag.upsert({
    where: { slug: 'vue' },
    update: {},
    create: { name: 'Vue', slug: 'vue' },
  });

  await prisma.post.upsert({
    where: { slug: 'hello-blog' },
    update: {},
    create: {
      title: '你好，博客',
      slug: 'hello-blog',
      excerpt: '这是一篇示例文章，用来验证前后端链路是否打通。',
      content: '# 你好，博客\n\n这是我的第一篇博客文章。',
      published: true,
      tags: { connect: [{ slug: 'nestjs' }, { slug: 'react' }] },
    },
  });

  await prisma.post.upsert({
    where: { slug: 'monorepo-notes' },
    update: {},
    create: {
      title: 'Monorepo 架构笔记',
      slug: 'monorepo-notes',
      excerpt: '使用 pnpm workspace 组织多应用仓库。',
      content: '## 目录结构\n\n- apps/api\n- apps/web\n- apps/admin\n- packages/shared',
      published: true,
      tags: { connect: [{ slug: 'vue' }, { slug: 'react' }] },
    },
  });

  console.log('Seed 完成');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
