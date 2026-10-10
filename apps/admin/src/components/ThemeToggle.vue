<script setup lang="ts">
import { onMounted, ref } from 'vue';

const label = ref('夜');

function paint() {
  label.value =
    document.documentElement.getAttribute('data-theme') === 'dark' ? '日' : '夜';
}

function toggle() {
  const root = document.documentElement;
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem('blog-theme', next);
  } catch {
    /* ignore */
  }
  paint();
}

onMounted(paint);
</script>

<template>
  <button
    class="icon-btn"
    type="button"
    aria-label="切换深浅色"
    @click="toggle"
  >
    {{ label }}
  </button>
</template>
