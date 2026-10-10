<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { EChartsCoreOption } from 'echarts/core';
import type { Tag } from '@hei-blog/shared';
import {
  IconFile,
  IconCheckCircle,
  IconEye,
  IconApps,
} from '@arco-design/web-vue/es/icon';
import EChart from '../components/EChart.vue';
import { listTags } from '../api/client';
import { usePostsStore } from '../stores/posts';
import { formatNumber, formatShortDate } from '../lib/format';

const store = usePostsStore();
const router = useRouter();
const tags = ref<Tag[]>([]);

onMounted(async () => {
  store.fetch();
  tags.value = await listTags();
});

const publishedCount = computed(
  () => store.items.filter((p) => p.published).length,
);
const totalViews = computed(() =>
  store.items.reduce((sum, p) => sum + p.viewCount, 0),
);
const recentPosts = computed(() => store.items.slice(0, 6));

const trendOption: EChartsCoreOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: 48, right: 24, top: 36, bottom: 32 },
  legend: {
    data: ['阅读量'],
    right: 8,
    top: 2,
    icon: 'circle',
    textStyle: { color: '#86909c' },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [
      '9.25', '9.26', '9.27', '9.28', '9.29', '9.30', '10.01',
      '10.02', '10.03', '10.04', '10.05', '10.06', '10.07', '10.08',
    ],
    axisLine: { lineStyle: { color: '#e7e9ef' } },
    axisTick: { show: false },
    axisLabel: { color: '#86909c', interval: 1 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#f0f1f4' } },
    axisLabel: { color: '#86909c' },
  },
  series: [
    {
      name: '阅读量',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 7,
      data: [320, 410, 380, 520, 610, 560, 720, 640, 700, 820, 760, 900, 840, 980],
      itemStyle: { color: '#5b7cfa' },
      lineStyle: { width: 3, color: '#5b7cfa' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(91,124,250,0.35)' },
            { offset: 1, color: 'rgba(91,124,250,0.02)' },
          ],
        },
      },
    },
  ],
};

const tagStats = computed(() => {
  const map = new Map<string, number>();
  store.items.forEach((post) => {
    const name = post.tags[0]?.name ?? '未分类';
    map.set(name, (map.get(name) ?? 0) + 1);
  });
  return [...map.entries()].map(([name, value]) => ({ name, value }));
});

const donutOption = computed<EChartsCoreOption>(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, icon: 'circle', textStyle: { color: '#86909c' } },
  color: ['#5b7cfa', '#7a5cf0', '#2f8ffb', '#00b42a', '#ff7d00', '#f53f3f'],
  series: [
    {
      type: 'pie',
      radius: ['52%', '74%'],
      center: ['50%', '44%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: tagStats.value.length ? tagStats.value : [{ name: '暂无', value: 1 }],
    },
  ],
}));
</script>

<template>
  <section class="stats">
    <div class="stat stat-1">
      <div class="stat-icon"><IconFile /></div>
      <div>
        <div class="stat-label">文章总数</div>
        <div class="stat-value">{{ store.total }}</div>
      </div>
    </div>
    <div class="stat stat-2">
      <div class="stat-icon"><IconCheckCircle /></div>
      <div>
        <div class="stat-label">已发布</div>
        <div class="stat-value">{{ publishedCount }}</div>
      </div>
    </div>
    <div class="stat stat-3">
      <div class="stat-icon"><IconEye /></div>
      <div>
        <div class="stat-label">累计阅读</div>
        <div class="stat-value">{{ formatNumber(totalViews) }}</div>
      </div>
    </div>
    <div class="stat stat-4">
      <div class="stat-icon"><IconApps /></div>
      <div>
        <div class="stat-label">分类</div>
        <div class="stat-value">{{ tags.length }}</div>
      </div>
    </div>
  </section>

  <section class="charts">
    <div class="panel">
      <div class="panel-head bordered">
        <div>
          <h2>阅读趋势</h2>
          <span class="panel-sub">近 14 天 · 示例数据</span>
        </div>
      </div>
      <div style="padding: 8px 12px 12px">
        <div class="chart-box"><EChart :option="trendOption" /></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head bordered">
        <div>
          <h2>分类分布</h2>
          <span class="panel-sub">按主分类统计</span>
        </div>
      </div>
      <div style="padding: 8px 12px 12px">
        <div class="chart-box"><EChart :option="donutOption" /></div>
      </div>
    </div>
  </section>

  <section class="panel">
    <div class="panel-head bordered">
      <h2>最近文章</h2>
      <button class="btn-text" type="button" @click="router.push('/posts')">
        查看全部 →
      </button>
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
        <tr v-for="post in recentPosts" :key="post.id">
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
            <button
              class="btn-outline primary"
              type="button"
              @click="router.push(`/posts/${post.id}/edit`)"
            >
              编辑
            </button>
          </td>
        </tr>
        <tr v-if="recentPosts.length === 0">
          <td colspan="6" style="text-align: center; color: var(--muted)">
            还没有文章。
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
