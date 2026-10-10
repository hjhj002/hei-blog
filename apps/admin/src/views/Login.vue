<script setup lang="ts">
import { useRouter } from 'vue-router';
import ThemeToggle from '../components/ThemeToggle.vue';

const router = useRouter();

function onLogin() {
  router.push('/overview');
}
</script>

<template>
  <ThemeToggle class="auth-theme" />

  <div class="auth">
    <div class="auth-card">
      <div class="auth-brand">
        <span class="logo-mark">慢</span>
        <b>慢写 管理系统</b>
      </div>

      <h2>密码登录</h2>

      <form @submit.prevent="onLogin">
        <div class="field">
          <input value="admin" placeholder="用户名" autocomplete="username" />
        </div>
        <div class="field">
          <input
            type="password"
            value="123456"
            placeholder="密码"
            autocomplete="current-password"
          />
        </div>
        <div class="auth-row">
          <label><input type="checkbox" /> 记住我</label>
          <a href="#">忘记密码？</a>
        </div>
        <button class="auth-submit" type="submit">确认</button>
      </form>

      <div class="auth-btns">
        <button class="btn-outline" type="button">验证码登录</button>
        <button class="btn-outline" type="button">注册账号</button>
      </div>

      <div class="auth-alt-divider">其他账号登录</div>
      <div class="auth-quick">
        <button type="button" @click="onLogin">管理员</button>
      </div>
    </div>
  </div>
</template>
