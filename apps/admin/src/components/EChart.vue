<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';

echarts.use([
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

const props = defineProps<{ option: EChartsCoreOption }>();
const el = ref<HTMLDivElement>();
let chart: ReturnType<typeof echarts.init> | null = null;

function render() {
  if (!el.value) return;
  if (!chart) {
    chart = echarts.init(el.value);
  }
  chart.setOption(props.option, true);
}

function resize() {
  chart?.resize();
}

onMounted(() => {
  render();
  window.addEventListener('resize', resize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  chart?.dispose();
  chart = null;
});

watch(() => props.option, render, { deep: true });
</script>

<template>
  <div ref="el" style="width: 100%; height: 100%"></div>
</template>
