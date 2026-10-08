# hei-blog

个人博客网站，采用 pnpm workspace 组织的 monorepo，一套代码仓同时管理三个应用与一个共享包。

## 技术栈

| 应用 | 目录 | 技术 |
| --- | --- | --- |
| 后端 API | `apps/api` | NestJS + Prisma + PostgreSQL |
| 前台 | `apps/web` | React + Vite + React Router |
| 后台管理 | `apps/admin` | Vue 3 + Vite + Vue Router + Pinia |
| 共享包 | `packages/shared` | TypeScript 类型与常量 |

## 目录结构

```
hei-blog/
├── apps/
│   ├── api/          # NestJS 后端（REST API + Swagger）
│   ├── web/          # React 前台
│   └── admin/        # Vue 后台管理
├── packages/
│   └── shared/       # 跨端共享的 TS 类型与常量
├── Makefile            # 常用命令封装
├── pnpm-workspace.yaml
└── package.json       # 根脚本编排
```

## 环境要求

- Node.js >= 20
- pnpm >= 10
- PostgreSQL >= 14

## 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 生成 Prisma Client（可重复执行）
pnpm db:generate

# 3. 初始化数据库（任选其一）
pnpm db:push     # 直接同步 schema，适合本地开发
pnpm db:migrate  # 生成并应用 migration，适合正式流程

# 4. 写入示例数据（可选）
pnpm db:seed

# 5. 同时启动三个应用
pnpm dev
```

> 也可以用 Makefile 一键完成：`make bootstrap`（初始化）→ `make dev`（启动），查看全部命令用 `make help`。

启动后：

- API：<http://localhost:3000/api>
- Swagger 文档：<http://localhost:3000/docs>
- 前台：<http://localhost:5173>
- 后台管理：<http://localhost:5174>

## 常用脚本

根目录脚本：

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 先构建 shared，再并行启动 api / web / admin |
| `pnpm build` | 构建全部应用 |
| `pnpm typecheck` | 全部包的类型检查 |
| `pnpm db:generate` | 生成 Prisma Client |
| `pnpm db:push` | 将 schema 同步到数据库 |
| `pnpm db:migrate` | 创建并应用 migration |
| `pnpm db:seed` | 写入示例数据 |
| `pnpm db:studio` | 打开 Prisma Studio |

也可以单独启动某个应用：

```bash
pnpm dev:api
pnpm dev:web
pnpm dev:admin
```

## 架构说明

### monorepo 组织

这里用 pnpm workspace 作为 monorepo 的编排层，因为需要同时承载三种技术栈：

- Nest 后端是 Node 应用；
- React 前台、Vue 后台是浏览器应用，由 Vite 管理。

它们在构建、依赖、类型上彼此独立，通过 `packages/shared` 共享同一份接口类型，保证前后端契约一致。

### Nest CLI 的使用

Nest CLI 在后端包内部工作。进入 `apps/api` 后，可以用官方命令生成新模块、控制器、服务、资源：

```bash
cd apps/api
npx nest g resource articles    # 生成一整套 CRUD 资源
npx nest g module auth           # 生成模块
npx nest g service auth          # 生成服务
```

> 说明：Nest CLI 自带的「monorepo 模式」（`nest g app` / `nest g lib`）用于管理多个 Nest 应用/库，无法生成 React / Vue 应用；因此本仓库用 pnpm workspace 统一管理所有包，Nest CLI 只负责后端包内的资源生成。

### 后端分层

- `src/prisma`：全局 `PrismaService`，封装数据库连接。
- `src/posts`：文章模块，区分公开接口（`PostsController`）与后台接口（`AdminPostsController`）。
- `src/tags`：标签模块。
- `src/health`：健康检查。
- 全局启用 `ValidationPipe`（白名单 + 隐式类型转换）与 CORS。
- Swagger 自动生成接口文档。

### 数据库

- 使用 Prisma ORM，schema 位于 `apps/api/prisma/schema.prisma`。
- 生成的 Client 输出到 `apps/api/generated/client`（已加入 `.gitignore`）。
- 本地连接串见 `apps/api/.env.example`。

## 环境变量

复制 `apps/api/.env.example` 为 `apps/api/.env`：

```bash
cp apps/api/.env.example apps/api/.env
```

默认连接本机 PostgreSQL（账号 `root`、密码 `123456`、数据库 `hei_blog`），如与本机实际配置不一致，请修改 `DATABASE_URL`。

## 下一步

- 接入身份认证（JWT + Passport），保护后台管理接口。
- 为后台增加权限控制与更完整的富文本编辑器。
- 前台文章渲染接入 Markdown。
- 补充单元测试与端到端测试。
