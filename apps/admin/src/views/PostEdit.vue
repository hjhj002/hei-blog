<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createPost, getPost, updatePost } from '../api/client';

const route = useRoute();
const router = useRouter();

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  published: false,
  tags: '',
});

const isEdit = Boolean(route.params.id);

onMounted(async () => {
  if (!isEdit) return;
  const post = await getPost(String(route.params.id));
  Object.assign(form, {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? '',
    content: post.content,
    published: post.published,
    tags: post.tags.map((tag) => tag.name).join(', '),
  });
});

async function submit() {
  const payload = {
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt || null,
    content: form.content,
    published: form.published,
    tags: form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  };

  if (isEdit) {
    await updatePost(String(route.params.id), payload);
  } else {
    await createPost(payload);
  }
  router.push('/');
}
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto; padding: 24px 16px">
    <h1>{{ isEdit ? '编辑文章' : '新建文章' }}</h1>
    <form @submit.prevent="submit" style="display: grid; gap: 12px">
      <input v-model="form.title" placeholder="标题" required />
      <input v-model="form.slug" placeholder="slug（英文短横线）" required />
      <textarea v-model="form.excerpt" placeholder="摘要" rows="2"></textarea>
      <textarea
        v-model="form.content"
        placeholder="正文（Markdown）"
        rows="12"
        required
      ></textarea>
      <input v-model="form.tags" placeholder="标签，逗号分隔" />
      <label>
        <input v-model="form.published" type="checkbox" />
        发布
      </label>
      <button type="submit">保存</button>
    </form>
  </div>
</template>
