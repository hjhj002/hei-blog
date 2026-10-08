import axios from 'axios';
import type { PaginatedResult, Post, Tag } from '@hei-blog/shared';

export const http = axios.create({
  baseURL: '/api',
});

export interface ListPostsParams {
  page?: number;
  pageSize?: number;
  tag?: string;
  q?: string;
}

export async function listPosts(
  params: ListPostsParams = {},
) {
  const { data } = await http.get<PaginatedResult<Post>>('/posts', { params });
  return data;
}

export async function getPost(slug: string) {
  const { data } = await http.get<Post>(`/posts/${slug}`);
  return data;
}

export async function listTags() {
  const { data } = await http.get<Tag[]>('/tags');
  return data;
}
