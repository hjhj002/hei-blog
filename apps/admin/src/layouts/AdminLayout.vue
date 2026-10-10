<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IconDashboard,
  IconFile,
  IconMessage,
  IconImage,
  IconUser,
  IconSettings,
  IconSearch,
  IconFullscreen,
  IconMenuFold,
  IconMenuUnfold,
  IconClose,
  IconRefresh,
} from '@arco-design/web-vue/es/icon';
import ThemeToggle from '../components/ThemeToggle.vue';
import { usePostsStore } from '../stores/posts';

interface MenuChild {
  key: string;
  label: string;
  path: string;
}
interface Menu {
  key: string;
  label: string;
  icon: unknown;
  path?: string;
  children?: MenuChild[];
}

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();

onMounted(() => postsStore.fetch());

const collapsed = ref(false);

const menus: Menu[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: IconDashboard,
    children: [{ key: 'overview', label: '概览', path: '/overview' }],
  },
  {
    key: 'content',
    label: '内容管理',
    icon: IconFile,
    children: [
      { key: 'posts', label: '文章列表', path: '/posts' },
      { key: 'post-new', label: '写新文章', path: '/posts/new' },
    ],
  },
  { key: 'comments', label: '评论', icon: IconMessage, path: '' },
  { key: 'media', label: '媒体', icon: IconImage, path: '' },
  { key: 'users', label: '用户', icon: IconUser, path: '' },
  { key: 'settings', label: '设置', icon: IconSettings, path: '' },
];

const openGroups = ref<string[]>(['dashboard', 'content']);

function toggleGroup(key: string) {
  const index = openGroups.value.indexOf(key);
  if (index >= 0) openGroups.value.splice(index, 1);
  else openGroups.value.push(key);
}

const activeKey = computed(() => {
  if (route.name === 'post-edit') return 'posts';
  return (route.name as string) ?? '';
});

const breadcrumb = computed(() => {
  const items: { label: string }[] = [];
  const group = route.meta.group as string | undefined;
  const title = route.meta.title as string | undefined;
  if (group) items.push({ label: group });
  if (title) items.push({ label: title });
  return items;
});

interface Tab {
  title: string;
  path: string;
  closable: boolean;
}

const tabs = ref<Tab[]>([{ title: '概览', path: '/overview', closable: false }]);

watch(
  () => route.path,
  () => {
    const title = (route.meta.title as string) ?? '页面';
    if (!tabs.value.find((tab) => tab.path === route.path)) {
      tabs.value.push({
        title,
        path: route.path,
        closable: route.path !== '/overview',
      });
    }
  },
  { immediate: true },
);

function closeTab(tab: Tab, event: Event) {
  event.stopPropagation();
  const index = tabs.value.indexOf(tab);
  tabs.value.splice(index, 1);
  if (route.path === tab.path) {
    const next = tabs.value[Math.max(0, index - 1)];
    router.push(next ? next.path : '/overview');
  }
}

function go(path: string) {
  if (path) router.push(path);
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen();
}

function refresh() {
  const path = route.path;
  router.replace('/overview').then(() => router.replace(path));
}
</script>

<template>
  <div class="app" :class="{ collapsed }">
    <aside class="side">
      <div class="side-logo">
        <span class="logo-mark">慢</span>
        <b>慢写 · 后台</b>
      </div>

      <nav class="side-menu">
        <template v-for="menu in menus" :key="menu.key">
          <div
            v-if="menu.children"
            class="menu-item"
            :class="{ open: openGroups.includes(menu.key) }"
            @click="toggleGroup(menu.key)"
          >
            <component :is="menu.icon" />
            <span>{{ menu.label }}</span>
            <span class="menu-arrow">›</span>
          </div>
          <div v-else class="menu-item" @click="go(menu.path ?? '')">
            <component :is="menu.icon" />
            <span>{{ menu.label }}</span>
          </div>

          <div v-if="menu.children && openGroups.includes(menu.key)" class="submenu">
            <div
              v-for="child in menu.children"
              :key="child.key"
              class="menu-item"
              :class="{ active: activeKey === child.key }"
              @click="go(child.path)"
            >
              <span>{{ child.label }}</span>
            </div>
          </div>
        </template>
      </nav>

      <div class="side-collapse" @click="collapsed = !collapsed">
        <component :is="collapsed ? IconMenuUnfold : IconMenuFold" />
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <div class="breadcrumb">
          <span>首页</span>
          <template v-for="(item, index) in breadcrumb" :key="index">
            <span class="sep">/</span>
            <span :class="{ current: index === breadcrumb.length - 1 }">
              {{ item.label }}
            </span>
          </template>
        </div>
        <div class="top-actions">
          <button class="icon-btn" type="button" title="搜索">
            <IconSearch />
          </button>
          <button class="icon-btn" type="button" title="全屏" @click="toggleFullscreen">
            <IconFullscreen />
          </button>
          <ThemeToggle />
          <div class="top-user">
            <span class="logo-mark" style="width: 26px; height: 26px; font-size: 13px">慢</span>
            <span>慢写</span>
          </div>
        </div>
      </header>

      <div class="tabs">
        <div
          v-for="tab in tabs"
          :key="tab.path"
          class="tab"
          :class="{ active: route.path === tab.path }"
          @click="router.push(tab.path)"
        >
          <span>{{ tab.title }}</span>
          <IconClose v-if="tab.closable" class="tab-close" @click="closeTab(tab, $event)" />
        </div>
        <div class="tabs-actions">
          <button class="icon-btn" type="button" title="刷新" @click="refresh">
            <IconRefresh />
          </button>
        </div>
      </div>

      <div class="content">
        <router-view />
      </div>

      <footer class="foot">Copyright © 2026 慢写 · 后台管理</footer>
    </div>
  </div>
</template>
