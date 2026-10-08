import axios from 'axios';
import type { PaginatedResult, Post } from '@hei-blog/shared';

export const http = axios.create({
  baseURL: '/api',
});

export async function listPosts(
  params: { page?: number; pageSize?: number; tag?: string; q?: string } = {},
) {
  const { data } = await http.get<PaginatedResult<Post>>('/posts', { params });
  return data;
}

export async function getPost(slug: string) {
  const { data } = await http.get<Post>(`/posts/${slug}`);
  return data;
}
