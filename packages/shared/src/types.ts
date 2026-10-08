export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface CreatePostInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  published?: boolean;
  tags?: string[];
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  published?: boolean;
  tags?: string[];
}

export interface ListPostsQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  tag?: string;
  published?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
