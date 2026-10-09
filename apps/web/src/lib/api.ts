import type { PaginatedResult, Post, Project, Tag } from '@hei-blog/shared';
import { alova } from './alova';

export interface ListPostsParams {
  page?: number;
  pageSize?: number;
  tag?: string;
  q?: string;
}

export function getPosts(params: ListPostsParams = {}) {
  return alova.Get<PaginatedResult<Post>>('/posts', { params });
}

export function getPost(slug: string) {
  return alova.Get<Post>(`/posts/${slug}`);
}

export function getTags() {
  return alova.Get<Tag[]>('/tags');
}

export function getProjects() {
  return alova.Get<Project[]>('/projects');
}
