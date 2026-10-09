import axios from 'axios';
import type { PaginatedResult, Post } from '@hei-blog/shared';

export const http = axios.create({ baseURL: '/api' });

export function listPosts(
  params: { page?: number; pageSize?: number; q?: string; published?: boolean } = {},
) {
  return http
    .get<PaginatedResult<Post>>('/admin/posts', { params })
    .then((response) => response.data);
}

export function getPost(id: string) {
  return http.get<Post>(`/admin/posts/${id}`).then((response) => response.data);
}

export function createPost(payload: Record<string, unknown>) {
  return http
    .post<Post>('/admin/posts', payload)
    .then((response) => response.data);
}

export function updatePost(id: string, payload: Record<string, unknown>) {
  return http
    .patch<Post>(`/admin/posts/${id}`, payload)
    .then((response) => response.data);
}

export function deletePost(id: string) {
  return http.delete(`/admin/posts/${id}`);
}

export function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return http
    .post<{ url: string }>('/uploads', formData)
    .then((response) => response.data.url);
}
