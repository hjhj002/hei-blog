import { defineStore } from 'pinia';
import type { Post } from '@hei-blog/shared';
import * as api from '../api/client';

export const usePostsStore = defineStore('posts', {
  state: () => ({
    items: [] as Post[],
    total: 0,
    loading: false,
  }),
  actions: {
    async fetch() {
      this.loading = true;
      try {
        const result = await api.listPosts({ pageSize: 100 });
        this.items = result.items;
        this.total = result.total;
      } finally {
        this.loading = false;
      }
    },
    async remove(id: string) {
      await api.deletePost(id);
      await this.fetch();
    },
  },
});
