<div align="center">

# hei-blog

一个用 pnpm workspace 组织的个人博客 monorepo —— 一套代码仓同时管理 **NestJS 后端**、**React 前台** 与 **Vue 后台管理**。

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D14-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## 目录

- [特性](#特性)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [环境变量](#环境变量)
- [可用脚本](#可用脚本)
- [API 文档](#api-文档)
- [数据模型](#数据模型)
- [架构说明](#架构说明)
- [开发指南](#开发指南)
- [部署](#部署)
- [路线图](#路线图)
- [常见问题](#常见问题)
- [贡献](#贡献)
- [许可证](#许可证)

---

## 特性

- **Monorepo 统一管理** —— pnpm workspace 编排，一个仓库承载三种技术栈，共享同一份接口类型。
- **类型安全的端到端契约** —— `packages/shared` 定义 `Post` / `Tag` 等类型，前后端与后台共用，改一处即可感知全局。
- **自动生成接口文档** —— 后端集成 Swagger，访问 `/docs` 即可查看并调试全部接口。
- **前后端分离** —— React 前台与 Vue 后台各自独立运行，通过 Vite 代理统一走 `/api` 前缀。
- **公开 / 管理接口分离** —— 文章模块拆分 `PostsController`（仅返回已发布）与 `AdminPostsController`（含草稿）。
- **标签多对多** —— 文章与标签通过 Prisma 隐式关联，支持按标签筛选与自动建标签。
- **健康检查** —— `GET /api/health` 同时返回服务状态与数据库连通性。
- **现代化 UI** —— 前台基于 Tailwind CSS + 自建 shadcn/ui 风格组件，支持深色模式。

---

## 技术栈

| 应用 | 包目录 | 技术 |
| :--- | :--- | :--- |
| 后端 API | `apps/api` | NestJS 11 + Prisma 6 + PostgreSQL |
| 博客前台 | `apps/web` | React 19 + Vite 6 + React Router 6 + alova 3 + Tailwind CSS 3 |
| 后台管理 | `apps/admin` | Vue 3.5 + Vite 6 + Vue Router 4 + Pinia 2 |
| 共享包 | `packages/shared` | TypeScript + tsup（CJS / ESM 双产物） |

---

## 目录结构

```
hei-blog/
├── apps/
│   ├── api/                    # NestJS 后端
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # 数据模型定义
│   │   │   └── seed.ts         # 示例数据脚本
│   │   └── src/
│   │       ├── health/         # 健康检查
│   │       ├── posts/          # 文章模块（公开 + 后台两套控制器）
│   │       ├── tags/           # 标签模块
│   │       ├── prisma/         # 全局 PrismaService
│   │       ├── app.module.ts
│   │       └── main.ts
│   ├── web/                    # React 前台
│   │   └── src/
│   │       ├── components/     # 站点组件 + ui 基础组件
│   │       ├── lib/            # API 客户端与格式化工具
│   │       ├── pages/          # Home / PostDetail
│   │       └── App.tsx
│   └── admin/                  # Vue 后台管理
│       └── src/
│           ├── api/            # 后台接口客户端
│           ├── router/         # 路由表
│           ├── stores/         # Pinia store
│           └── views/          # PostList / PostEdit
├── packages/
│   └── shared/                 # 跨端共享的 TS 类型与常量
├── Makefile                    # 常用命令封装
├── pnpm-workspace.yaml
└── package.json                # 根脚本编排
```

---

## 环境要求

| 依赖 | 版本 | 说明 |
| :--- | :--- | :--- |
| [Node.js](https://nodejs.org/) | `>= 20` | 由根 `package.json` 的 `engines` 约束 |
| [pnpm](https://pnpm.io/) | `>= 10` | 仓库使用 `pnpm@11.22.0`，通过 `corepack` 可自动切换 |
| [PostgreSQL](https://www.postgresql.org/) | `>= 14` | 需提前创建数据库（默认 `hei_blog`） |

安装 pnpm：

```bash
corepack enable
corepack prepare pnpm@11.22.0 --activate
```

---

## 快速开始

### 1. 克隆并安装依赖

```bash
git clone https://github.com/<your-username>/hei-blog.git
cd hei-blog
pnpm install
```

### 2. 配置环境变量

```bash
cp apps/api/.env.example apps/api/.env
# 按需修改 DATABASE_URL
```

### 3. 初始化数据库

```bash
pnpm db:generate   # 生成 Prisma Client（可重复执行）
pnpm db:push       # 同步 schema 到本地数据库（开发环境推荐）
pnpm db:seed       # 写入示例文章与标签（可选）
```

> 正式流程建议使用 migration：`pnpm db:migrate`。

### 4. 启动全部应用

```bash
pnpm dev
```

也可以只用 Makefile 完成初始化与启动：

```bash
make bootstrap   # 安装依赖 + 生成 .env + 建表 + 示例数据
make dev         # 启动全部应用
make help        # 查看所有命令
```

### 5. 访问

| 服务 | 地址 |
| :--- | :--- |
| 博客前台 | <http://localhost:5173> |
| 后台管理 | <http://localhost:5174> |
| API 根路径 | <http://localhost:3000/api> |
| Swagger 文档 | <http://localhost:3000/docs> |
| 健康检查 | <http://localhost:3000/api/health> |

---

## 环境变量

配置文件位于 `apps/api/.env`（复制自 `apps/api/.env.example`）：

```dotenv
# 服务端口
PORT=3000

# PostgreSQL 连接串
DATABASE_URL="postgresql://用户名:密码@localhost:5432/hei_blog?schema=public"

# MinIO 对象存储
MINIO_ENDPOINT=localhost
MINIO_PORT=9010
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=hei-blog
MINIO_SECRET_KEY=hei-blog123
MINIO_BUCKET=hei-blog
```

| 变量 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `PORT` | `3000` | 后端监听端口 |
| `DATABASE_URL` | — | Prisma 使用的 PostgreSQL 连接串 |
| `MINIO_ENDPOINT` | `localhost` | MinIO 服务地址 |
| `MINIO_PORT` | `9010` | MinIO API 端口 |
| `MINIO_ACCESS_KEY` | `hei-blog` | MinIO 访问密钥 |
| `MINIO_SECRET_KEY` | `hei-blog123` | MinIO 密钥 |
| `MINIO_BUCKET` | `hei-blog` | 存储桶名称 |

> `.env` 已在 `.gitignore` 中忽略，请勿提交真实凭据。

## 图片存储（MinIO）

文章封面等图片存储在 MinIO（S3 兼容对象存储）。后端启动时会自动创建 `hei-blog` 桶并设为公开读。

本地用 Docker 起一个独立 MinIO（与 `medical-minio` 互不冲突，端口 9010/9011）：

```bash
docker run -d --name hei-blog-minio \
  -p 9010:9000 -p 9011:9001 \
  -e MINIO_ROOT_USER=hei-blog \
  -e MINIO_ROOT_PASSWORD=hei-blog123 \
  -v hei_blog_minio_data:/data \
  minio/minio server /data --console-address ":9001"
```

- API：`http://localhost:9010`，控制台：`http://localhost:9011`
- 上传接口：`POST /api/uploads`（`multipart/form-data`，字段名 `file`），返回 `{ "url": "..." }`
- 后台管理「新建/编辑文章」里的封面图上传即调用该接口，返回的 URL 写入文章 `coverImage` 字段

---

## 可用脚本

### 根目录脚本

| 命令 | 说明 |
| :--- | :--- |
| `pnpm dev` | 先构建 `shared`，再并行启动 api / web / admin |
| `pnpm dev:api` | 仅启动后端（Nest 监听模式） |
| `pnpm dev:web` | 仅启动前台 |
| `pnpm dev:admin` | 仅启动后台 |
| `pnpm build` | 构建 shared 及全部应用 |
| `pnpm build:shared` | 仅构建共享包 |
| `pnpm typecheck` | 全量类型检查（shared + api + web + admin） |
| `pnpm lint` | 后端 ESLint 检查并修复 |
| `pnpm format` | Prettier 格式化全仓 |
| `pnpm db:generate` | 生成 Prisma Client |
| `pnpm db:push` | 将 schema 同步到数据库 |
| `pnpm db:migrate` | 创建并应用 migration |
| `pnpm db:seed` | 写入示例数据 |
| `pnpm db:studio` | 打开 Prisma Studio |

### Makefile 命令

| 命令 | 说明 |
| :--- | :--- |
| `make help` | 列出所有可用命令 |
| `make install` | 安装依赖 |
| `make env` | 生成 `apps/api/.env`（若不存在） |
| `make bootstrap` | 一键初始化：依赖 + 环境变量 + 建表 + 示例数据 |
| `make dev` / `make dev-api` / `make dev-web` / `make dev-admin` | 启动服务 |
| `make build` | 构建全部应用 |
| `make typecheck` | 全量类型检查 |
| `make db-generate` / `db-push` / `db-migrate` / `db-seed` / `db-studio` | 数据库相关 |
| `make clean` | 清理全部构建产物 |

---

## API 文档

后端全局前缀为 `/api`，Swagger 文档位于 `/docs`。

### 公开接口

| 方法 | 路径 | 说明 |
| :--- | :--- | :--- |
| `GET` | `/api` | 服务信息与版本 |
| `GET` | `/api/health` | 健康检查（含数据库连通性） |
| `GET` | `/api/posts` | 文章列表（仅已发布，支持分页 / 搜索 / 标签筛选） |
| `GET` | `/api/posts/:slug` | 文章详情（按 slug） |
| `GET` | `/api/tags` | 标签列表 |

### 后台接口

| 方法 | 路径 | 说明 |
| :--- | :--- | :--- |
| `GET` | `/api/admin/posts` | 文章列表（含草稿） |
| `GET` | `/api/admin/posts/:id` | 按 ID 查询文章 |
| `POST` | `/api/admin/posts` | 新建文章 |
| `PATCH` | `/api/admin/posts/:id` | 更新文章 |
| `DELETE` | `/api/admin/posts/:id` | 删除文章 |

### 列表查询参数

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `page` | number | `1` | 页码，最小 1 |
| `pageSize` | number | `10` | 每页条数，1–100 |
| `q` | string | — | 按标题或正文模糊搜索（不区分大小写） |
| `tag` | string | — | 按标签 slug 过滤 |
| `published` | boolean | — | 是否已发布（公开接口强制为 `true`） |

响应统一为分页结构：

```json
{
  "items": [ /* Post[] */ ],
  "total": 42,
  "page": 1,
  "pageSize": 10
}
```

示例调用：

```bash
curl "http://localhost:3000/api/posts?page=1&pageSize=5&tag=nestjs"
```

> ⚠️ 后台接口目前**未接入鉴权**，请勿直接部署到公网环境。

---

## 数据模型

Schema 位于 `apps/api/prisma/schema.prisma`，包含两个模型，通过 Prisma 隐式多对多关联：

| 模型 | 字段 |
| :--- | :--- |
| `Post` | `id`、`title`、`slug`（唯一）、`excerpt?`、`content`、`published`（默认 `false`）、`viewCount`（默认 `0`）、`createdAt`、`updatedAt`、`tags` |
| `Tag` | `id`、`name`（唯一）、`slug`（唯一）、`posts` |

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  excerpt   String?
  content   String
  published Boolean  @default(false)
  viewCount Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tags      Tag[]
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
  posts Post[]
}
```

> Prisma Client 输出到 `apps/api/generated/client`（已加入 `.gitignore`，每次 `pnpm install` 或 `pnpm db:generate` 后重新生成）。

---

## 架构说明

### 为什么用 pnpm workspace

Nest CLI 自带的 monorepo 模式（`nest g app` / `nest g lib`）只能管理多个 Nest 应用或库，无法生成 React / Vue 应用。本仓库需要同时承载三种技术栈：

- Nest 后端是 Node 应用；
- React 前台与 Vue 后台是浏览器应用，由 Vite 管理。

因此由 **pnpm workspace 作为统一编排层**，各包在构建、依赖、类型上彼此独立，通过 `packages/shared` 共享同一份接口类型，保证前后端契约一致。Nest CLI 仅在后端包内部用于生成资源。

### 后端分层

- `src/prisma`：全局 `PrismaService`，封装数据库连接与生命周期。
- `src/posts`：文章模块，区分公开接口（`PostsController`）与后台接口（`AdminPostsController`），业务逻辑统一收敛在 `PostsService`。
- `src/tags`：标签模块。
- `src/health`：健康检查，通过 `SELECT 1` 探测数据库。
- 全局启用 `ValidationPipe`（白名单 + 隐式类型转换）、CORS 与 Swagger。

### 请求链路

```
浏览器 (5173 / 5174)
        │  /api/*
        ▼
   Vite dev proxy  ──►  Nest API (3000)
                              │
                              ▼
                        Prisma ──► PostgreSQL
```

生产环境由反向代理（Nginx / Caddy）承担 `/api` 转发。

---

## 开发指南

### 新增后端资源

```bash
cd apps/api
npx nest g resource articles   # 生成一整套 CRUD 资源
npx nest g module auth         # 仅生成模块
npx nest g service auth        # 仅生成服务
```

### 共享包改动

修改 `packages/shared/src` 后需重新构建，其他包才能拿到最新类型：

```bash
pnpm build:shared      # 一次性构建
pnpm dev:shared        # 监听模式
```

### 新增前台页面

在 `apps/web/src/pages` 创建组件，并在 `apps/web/src/App.tsx` 中注册路由。`@` 已别名到 `src`。

### 新增后台页面

在 `apps/admin/src/views` 创建 `.vue` 组件，并在 `apps/admin/src/router/index.ts` 中注册路由。

### 提交前自检

```bash
pnpm typecheck
pnpm lint
pnpm format
```

---

## 部署

### 构建产物

```bash
pnpm build
```

| 应用 | 产物目录 | 启动方式 |
| :--- | :--- | :--- |
| `apps/api` | `apps/api/dist` | `node dist/main`（或 `pnpm --filter @hei-blog/api start:prod`） |
| `apps/web` | `apps/web/dist` | 静态托管 |
| `apps/admin` | `apps/admin/dist` | 静态托管（Vue Router history 模式需配置 fallback） |

### 生产环境注意事项

1. 使用 `pnpm db:migrate`（`prisma migrate deploy`）替代 `db:push`，保留可追溯的 migration 记录。
2. 通过环境变量注入 `DATABASE_URL` 与 `PORT`，不要提交 `.env`。
3. 为后台接口补充鉴权（`apps/api/src/posts/admin-posts.controller.ts`）。
4. 反向代理将 `/api` 转发到后端，其余路径指向前台静态资源。

---

## 路线图

- [ ] 接入身份认证（JWT + Passport），保护后台管理接口
- [ ] 后台权限控制与更完整的富文本编辑器
- [ ] 前台文章渲染接入 Markdown
- [ ] 文章浏览量统计与热门排行
- [ ] 补充单元测试与端到端测试
- [ ] CI 流水线（类型检查 + 构建 + 测试）
- [ ] Docker / Docker Compose 一键启动

---

## 常见问题

**`pnpm db:push` 报连接失败？**

检查 PostgreSQL 是否已启动，以及 `apps/api/.env` 中 `DATABASE_URL` 的账号、密码、端口与数据库名是否正确。数据库需提前手动创建：

```bash
createdb hei_blog
```

**修改了 `packages/shared` 但类型没更新？**

共享包需要重新构建：`pnpm build:shared`。

**前台 / 后台接口 404？**

两个前端都通过 Vite 代理访问 `/api`，请确保后端已启动在 `3000` 端口。

**Prisma Client 报类型错误？**

执行 `pnpm db:generate` 重新生成 Client 到 `apps/api/generated/client`。

---

## 贡献

欢迎提交 Issue 与 Pull Request。

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交改动：`git commit -m "feat: add your feature"`
4. 推送分支：`git push origin feature/your-feature`
5. 发起 Pull Request

提交前请运行 `pnpm typecheck && pnpm lint`。

---

## 许可证

[MIT](./LICENSE) © hei-blog
