<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { createPost, getPost, updatePost, uploadImage } from '../api/client';

const route = useRoute();
const router = useRouter();

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  published: true,
  tags: '',
});

const isEdit = Boolean(route.params.id);
const submitting = ref(false);
const uploading = ref(false);
const error = ref('');
const editorEl = ref<HTMLDivElement>();
let vditor: Vditor | null = null;

onMounted(async () => {
  if (isEdit) {
    const post = await getPost(String(route.params.id));
    Object.assign(form, {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      content: post.content,
      coverImage: post.coverImage ?? '',
      published: post.published,
      tags: post.tags.map((tag) => tag.name).join(', '),
    });
  }
  initEditor();
});

onBeforeUnmount(() => {
  vditor?.destroy();
  vditor = null;
});

function initEditor() {
  if (!editorEl.value) return;
  vditor = new Vditor(editorEl.value, {
    mode: 'ir',
    height: 520,
    placeholder: '开始写文章…（支持粘贴 / 拖拽上传图片）',
    cache: { enable: false },
    input: (value: string) => {
      form.content = value;
    },
    upload: {
      url: '/api/uploads',
      fieldName: 'file',
      accept: 'image/*,.pdf,.zip,.md,.txt',
      // 后端返回 { url }，转成 Vditor 需要的数据结构，由 Vditor 负责插入图片/链接
      format: (files, responseText) => {
        try {
          const data = JSON.parse(responseText) as { url?: string };
          const name = files[0]?.name ?? 'file';
          return JSON.stringify({
            msg: '',
            code: 0,
            data: { errFiles: [], succMap: data.url ? { [name]: data.url } : {} },
          });
        } catch {
          return JSON.stringify({
            msg: '上传失败',
            code: 1,
            data: { errFiles: [], succMap: {} },
          });
        }
      },
    },
    after: () => {
      vditor?.setValue(form.content);
    },
  });
}

async function onCoverChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  uploading.value = true;
  try {
    form.coverImage = await uploadImage(file);
  } finally {
    uploading.value = false;
  }
}

async function submit() {
  error.value = '';
  if (!form.title.trim()) {
    error.value = '请输入标题';
    return;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
    error.value = 'slug 只能包含小写字母、数字与短横线';
    return;
  }
  if (!form.content.trim()) {
    error.value = '请输入正文';
    return;
  }

  submitting.value = true;
  try {
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content,
      coverImage: form.coverImage || null,
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
    router.push('/posts');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section class="panel">
    <div class="panel-head bordered">
      <h2>{{ isEdit ? '编辑文章' : '写新文章' }}</h2>
      <button class="btn-outline" type="button" @click="router.push('/posts')">
        返回列表
      </button>
    </div>

    <div class="panel-body" style="padding-top: 16px">
    <form class="post-form" @submit.prevent="submit">
      <div class="field">
        <label for="title">标题</label>
        <input id="title" v-model="form.title" placeholder="文章标题" />
      </div>

      <div class="field">
        <label for="slug">Slug</label>
        <input id="slug" v-model="form.slug" placeholder="英文短横线，如 my-first-post" />
      </div>

      <div class="field">
        <label for="excerpt">摘要</label>
        <textarea id="excerpt" v-model="form.excerpt" rows="3" placeholder="一句话摘要"></textarea>
      </div>

      <div class="field">
        <label for="content">正文</label>
        <div ref="editorEl"></div>
      </div>

      <div class="field">
        <label>封面图片</label>
        <label class="cover-uploader">
          <img v-if="form.coverImage" :src="form.coverImage" alt="封面预览" />
          <span v-else class="placeholder">{{ uploading ? '上传中…' : '点击上传封面' }}</span>
          <input type="file" accept="image/*" hidden @change="onCoverChange" />
        </label>
      </div>

      <div class="field">
        <label for="tags">标签</label>
        <input id="tags" v-model="form.tags" placeholder="逗号分隔，如：设计, 前端" />
      </div>

      <div class="field">
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer">
          <input v-model="form.published" type="checkbox" style="width: 16px; height: 16px" />
          发布
        </label>
      </div>

      <p v-if="error" style="color: var(--danger); font-size: 13px">{{ error }}</p>

      <div class="form-actions">
        <button class="btn-primary" type="submit" :disabled="submitting">
          {{ submitting ? '保存中…' : '保存' }}
        </button>
        <button class="btn-outline" type="button" @click="router.push('/posts')">
          取消
        </button>
      </div>
    </form>
    </div>
  </section>
</template>
