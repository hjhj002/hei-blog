import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

const tags = [
  { name: '设计', slug: 'design' },
  { name: '前端', slug: 'frontend' },
  { name: '产品', slug: 'product' },
  { name: '读书', slug: 'reading' },
  { name: '随笔', slug: 'essays' },
];

const posts = [
  {
    title: '用滚动动画讲一个产品的故事',
    slug: 'scroll-storytelling',
    excerpt:
      '当页面本身成为叙事的一部分，滚动就不再只是浏览，而是推进情节的方式。这篇整理了我最近做滚动叙事时踩过的坑和最后的方案。',
    content:
      '把产品介绍做成一段可以“滚”的故事，是我最近一直在试的方向。\n\n传统的落地页是一张张静态海报，而滚动叙事让每一屏之间有了因果：用户往下滚，画面跟着推进，产品的能力在这个过程中被一点点揭开。\n\n实现上最关键的不是动画本身，而是节奏。每一段滚动距离对应多少画面变化、关键帧之间怎么补间，决定了它是“有呼吸”的叙事，还是一堆乱跳的特效。',
    published: true,
    createdAt: new Date('2026-10-06T09:00:00+08:00'),
    tags: ['design'],
  },
  {
    title: '让交互跟着指针走：一次视线跟随的实现',
    slug: 'gaze-follow-cursor',
    excerpt:
      '从角度映射到平滑跟随，拆解一个「眼睛始终看着鼠标」的小组件是怎么做的。',
    content:
      '一个会跟着鼠标转头的小猫，看起来只是个小彩蛋，背后其实是角度计算、平滑阻尼和帧插值三个问题。\n\n先算出容器中心到指针的方向角，再把这个角度映射到一段循环视频的帧上；中间的过渡用带阻尼的缓动，才能不显得机械。\n\n这种“视线跟随”的思路可以复用到很多地方：角色、图标、甚至整个页面的光影。',
    published: true,
    createdAt: new Date('2026-09-28T09:00:00+08:00'),
    tags: ['frontend'],
  },
  {
    title: '做 3D 角色时，我先定的是材质',
    slug: 'material-first-3d',
    excerpt: '体积感不是靠加细节，而是靠光、阴影和材质之间的关系。一次角色设计的复盘。',
    content:
      '很多人做 3D 角色会先抠造型，但我更习惯先定材质。\n\n体积感来自光和材质的关系：同样的轮廓，哑光和金属、粗糙和光滑，气质完全不同。先把材质的“手感”定下来，再回头推造型，方向会清晰很多。\n\n这一篇复盘我最近做奶牛猫角色的过程。',
    published: true,
    createdAt: new Date('2026-09-20T09:00:00+08:00'),
    tags: ['design'],
  },
  {
    title: '首屏到底要放什么',
    slug: 'what-goes-above-the-fold',
    excerpt: '把首屏当成一次自我介绍：三秒内让人知道你是谁、做什么、下一步去哪。',
    content:
      '首屏只有三秒的机会。\n\n它要回答三件事：你是谁、你做什么、接下来去哪。其他都是噪音。\n\n所以我给自己的原则是：一句话定位、一个清晰的主行动、不要超过两个次要出口。剩下的交给内容。',
    published: true,
    createdAt: new Date('2026-09-12T09:00:00+08:00'),
    tags: ['product'],
  },
  {
    title: '《设计中的设计》里我划的三句话',
    slug: 'three-lines-design-of-design',
    excerpt: '不是读后感，是摘录和一点自己的注解，关于「设计是解决什么」。',
    content:
      '“设计不是装饰，而是解决问题。”\n\n这句话我最早看不懂，做久了才慢慢明白：好看的背后一定有功能，形式的每一次取舍都在回答某个问题。\n\n另外两句关于“再设计”和“日常的陌生化”的摘录，也一并记在这里。',
    published: true,
    createdAt: new Date('2026-09-03T09:00:00+08:00'),
    tags: ['reading'],
  },
  {
    title: '视频能不能当帧序列用',
    slug: 'video-as-sprite-sheet',
    excerpt: '把带透明通道的视频当可随机访问的帧用，关键帧间隔和 seek 延迟是绕不开的两个点。',
    content:
      '想把一段循环动画做成“能随机跳转到任意帧”的效果，视频比雪碧图更省体积，但也更麻烦。\n\n关键帧间隔决定了 seek 的精度，而 seek 本身是有延迟的，拖动太快就会卡。于是需要在精度、体积和流畅度之间做权衡。\n\n这篇记录我踩过的坑和最后的取舍。',
    published: true,
    createdAt: new Date('2026-08-24T09:00:00+08:00'),
    tags: ['frontend'],
  },
  {
    title: '我把博客从零重写了一遍',
    slug: 'rewriting-my-blog',
    excerpt: '没有选现成框架，只是想弄清楚一个静态博客最少需要什么，以及我到底想要什么。',
    content:
      '这是第三次重写博客了。\n\n前两次都停在“用哪个框架”，这次我反过来问：一个博客最少需要什么？文章、分类、一点点关于我的东西。\n\n想清楚之后，反而不再纠结技术选型了。',
    published: true,
    createdAt: new Date('2026-08-15T09:00:00+08:00'),
    tags: ['essays'],
  },
  {
    title: '你好，博客',
    slug: 'hello-blog',
    excerpt: '第一篇测试文章，用来验证前后端链路是否打通。',
    content:
      '这里是奶油笔记。\n\n以后我会在这里记录做产品、做设计、写代码时的思考与踩坑。不定期更新，尽量写得有用。',
    published: true,
    createdAt: new Date('2026-08-01T09:00:00+08:00'),
    tags: ['essays', 'design'],
  },
];

const projects = [
  {
    name: '奶油笔记',
    slug: 'cream-notes',
    description:
      '你现在看到的这个博客：NestJS + React + Vue 的 monorepo，带深色模式和滚动叙事刊头。',
    content:
      '一个练习完整全栈流程的博客项目。后端 NestJS + Prisma + PostgreSQL，前台 React + alova，后台 Vue，图片走 MinIO 对象存储。',
    url: 'https://example.com/cream-notes',
    repo: 'https://github.com/example/cream-notes',
    coverImage: null,
    tech: ['NestJS', 'React', 'Vue', 'Prisma', 'MinIO'],
    featured: true,
    sort: 1,
    createdAt: new Date('2026-09-15T09:00:00+08:00'),
  },
  {
    name: '视线跟随的小猫',
    slug: 'gaze-follow-kitten',
    description:
      '一个会跟着鼠标扭头看的 3D 奶牛猫组件，透明视频 + 帧插值，可作为网站彩蛋。',
    content:
      '把 3D 奶牛猫按帧抠图得到真实 Alpha，再用 VP9 WebM 保留透明通道，通过角度映射和阻尼平滑实现视线跟随。',
    url: 'https://example.com/kitten',
    repo: 'https://github.com/example/kitten',
    coverImage: null,
    tech: ['Blender', 'WebM', 'JavaScript'],
    featured: true,
    sort: 2,
    createdAt: new Date('2026-09-05T09:00:00+08:00'),
  },
  {
    name: '滚动叙事引擎',
    slug: 'scroll-storytelling-engine',
    description: '把产品介绍做成可以“滚”的故事，滚动进度驱动画面推进。',
    content:
      '一个轻量的滚动叙事运行时，把滚动距离映射到时间轴，支持关键帧与补间。',
    url: null,
    repo: 'https://github.com/example/scroll-story',
    coverImage: null,
    tech: ['TypeScript', 'Vite'],
    featured: false,
    sort: 3,
    createdAt: new Date('2026-08-20T09:00:00+08:00'),
  },
  {
    name: '帧序列视频播放器',
    slug: 'frame-video-player',
    description: '把带透明通道的视频当可随机访问的帧序列用，seek 到任意帧。',
    content: '在体积、精度和流畅度之间做权衡，解决 seek 延迟与关键帧间隔的问题。',
    url: null,
    repo: 'https://github.com/example/frame-player',
    coverImage: null,
    tech: ['WebM', 'Canvas'],
    featured: false,
    sort: 4,
    createdAt: new Date('2026-08-01T09:00:00+08:00'),
  },
  {
    name: '图片托管小工具',
    slug: 'minio-image-hosting',
    description: '基于 MinIO 的图片上传与托管服务，配合博客封面使用。',
    content:
      'S3 兼容的对象存储封装，上传后返回公开 URL，支持图片格式校验与大小限制。',
    url: null,
    repo: 'https://github.com/example/image-hosting',
    coverImage: null,
    tech: ['NestJS', 'MinIO'],
    featured: false,
    sort: 5,
    createdAt: new Date('2026-07-20T09:00:00+08:00'),
  },
];

async function main() {
  // seed 属于开发环境：先清空再写入，保证每次结果一致、可重复执行。
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.project.deleteMany();

  for (const tag of tags) {
    await prisma.tag.create({ data: tag });
  }

  for (const post of posts) {
    const { tags: postTags, ...data } = post;
    await prisma.post.create({
      data: {
        ...data,
        tags: { connect: postTags.map((slug) => ({ slug })) },
      },
    });
  }

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log(
    `Seed 完成：${tags.length} 个分类，${posts.length} 篇文章，${projects.length} 个项目`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
