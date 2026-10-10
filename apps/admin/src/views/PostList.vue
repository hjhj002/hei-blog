<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Post } from '@hei-blog/shared';
import {
  IconDown,
  IconPlus,
  IconRefresh,
} from '@arco-design/web-vue/es/icon';
import { usePostsStore } from '../stores/posts';
import { formatNumber, formatShortDate } from '../lib/format';

const store = usePostsStore();
const router = useRouter();
const keyword = ref('');
const status = ref('all');
const searchOpen = ref(true);

onMounted(() => store.fetch());

const publishedCount = computed(
  () => store.items.filter((p) => p.published).length,
);

const filtered = computed(() => {
  let list = store.items;
  const q = keyword.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        (post.excerpt ?? '').toLowerCase().includes(q),
    );
  }
  if (status.value === 'published') list = list.filter((p) => p.published);
  if (status.value === 'draft') list = list.filter((p) => !p.published);
  return list;
});

function onDelete(post: Post) {
  if (window.confirm(`确定要删除《${post.title}》吗？`)) {
    store.remove(post.id);
  }
}
</script>

<template>
  <div class="search-panel">
    <div class="search-panel-head" @click="searchOpen = !searchOpen">
      <IconDown :style="{ transform: searchOpen ? 'none' : 'rotate(-90deg)' }" />
      <span>搜索</span>
    </div>
    <div v-if="searchOpen" class="search-panel-body">
      <div class="field" style="margin-bottom: 0">
        <label>关键词</label>
        <input v-model="keyword" placeholder="标题或摘要" />
      </div>
      <div class="field" style="margin-bottom: 0">
        <label>状态</label>
        <select v-model="status">
          <option value="all">全部（{{ store.total }}）</option>
          <option value="published">已发布（{{ publishedCount }}）</option>
          <option value="draft">草稿（{{ store.total - publishedCount }}）</option>
        </select>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head bordered">
      <h2>文章列表</h2>
      <div class="table-toolbar" style="margin-bottom: 0">
        <button
          class="btn-outline primary"
          type="button"
          @click="router.push('/posts/new')"
        >
          <IconPlus /> 新增
        </button>
        <button class="btn-outline" type="button" @click="store.fetch()">
          <IconRefresh /> 刷新
        </button>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th class="col-title">标题</th>
          <th>分类</th>
          <th>状态</th>
          <th>阅读</th>
          <th>更新于</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in filtered" :key="post.id">
          <td class="col-title">{{ post.title }}</td>
          <td><span class="tag">{{ post.tags[0]?.name ?? '未分类' }}</span></td>
          <td>
            <span class="tag" :class="post.published ? 'success' : 'warning'">
              {{ post.published ? '已发布' : '草稿' }}
            </span>
          </td>
          <td>{{ formatNumber(post.viewCount) }}</td>
          <td>{{ formatShortDate(post.updatedAt) }}</td>
          <td>
            <div style="display: flex; gap: 8px">
              <button
                class="btn-outline primary"
                type="button"
                @click="router.push(`/posts/${post.id}/edit`)"
              >
                编辑
              </button>
              <button
                class="btn-outline danger"
                type="button"
                @click="onDelete(post)"
              >
                删除
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="filtered.length === 0">
          <td colspan="6" style="text-align: center; color: var(--muted)">
            没有匹配的文章。
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pager">
      <span>共 {{ filtered.length }} 条</span>
      <div class="pages">
        <button class="active" type="button">1</button>
      </div>
    </div>
  </div>
</template>
