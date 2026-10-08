<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePostsStore } from '../stores/posts';

const store = usePostsStore();
const router = useRouter();

onMounted(() => store.fetch());
</script>

<template>
  <div style="max-width: 960px; margin: 0 auto; padding: 24px 16px">
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
      "
    >
      <h1>文章管理</h1>
      <button @click="router.push('/posts/new')">新建文章</button>
    </div>

    <p v-if="store.loading">加载中…</p>
    <p v-else-if="store.items.length === 0">暂无文章。</p>

    <table v-else width="100%" cellspacing="0" cellpadding="8">
      <thead>
        <tr>
          <th align="left">标题</th>
          <th align="left">状态</th>
          <th align="left">标签</th>
          <th align="left">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in store.items" :key="post.id">
          <td>{{ post.title }}</td>
          <td>{{ post.published ? '已发布' : '草稿' }}</td>
          <td>{{ post.tags.map((tag) => tag.name).join(', ') }}</td>
          <td>
            <button @click="router.push(`/posts/${post.id}/edit`)">编辑</button>
            <button @click="store.remove(post.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
