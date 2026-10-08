.DEFAULT_GOAL := help

PNPM := pnpm

.PHONY: help install env bootstrap db-generate db-push db-migrate db-seed db-studio dev dev-api dev-web dev-admin build typecheck clean

help: ## 显示所有可用命令
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

install: ## 安装依赖
	@$(PNPM) install

env: ## 生成 apps/api/.env（若不存在）
	@test -f apps/api/.env || cp apps/api/.env.example apps/api/.env
	@echo "✅ apps/api/.env 已就绪"

bootstrap: install env db-generate db-push db-seed ## 一键初始化（依赖+建表+示例数据）
	@echo "✅ 初始化完成，运行 make dev 启动"

db-generate: env ## 生成 Prisma Client
	@$(PNPM) db:generate

db-push: env ## 同步 schema 到数据库
	@$(PNPM) db:push

db-migrate: env ## 创建并应用 migration
	@$(PNPM) db:migrate

db-seed: env ## 写入示例数据
	@$(PNPM) db:seed

db-studio: env ## 打开 Prisma Studio
	@$(PNPM) db:studio

dev: ## 启动全部应用（api + web + admin）
	@$(PNPM) dev

dev-api: ## 仅启动后端 API
	@$(PNPM) dev:api

dev-web: ## 仅启动前台
	@$(PNPM) dev:web

dev-admin: ## 仅启动后台管理
	@$(PNPM) dev:admin

build: ## 构建全部应用
	@$(PNPM) build

typecheck: ## 全量类型检查
	@$(PNPM) typecheck

clean: ## 清理构建产物
	@rm -rf apps/api/dist apps/api/generated apps/web/dist apps/admin/dist packages/shared/dist
	@echo "✅ 构建产物已清理"
