import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';

const Login = () => import('../views/Login.vue');
const Dashboard = () => import('../views/Dashboard.vue');
const PostList = () => import('../views/PostList.vue');
const PostEdit = () => import('../views/PostEdit.vue');

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: '登录' },
    },
    {
      path: '/',
      component: AdminLayout,
      children: [
        { path: '', redirect: '/overview' },
        {
          path: 'overview',
          name: 'overview',
          component: Dashboard,
          meta: { title: '概览', group: '仪表盘' },
        },
        {
          path: 'posts',
          name: 'posts',
          component: PostList,
          meta: { title: '文章列表', group: '内容管理' },
        },
        {
          path: 'posts/new',
          name: 'post-new',
          component: PostEdit,
          meta: { title: '写新文章', group: '内容管理' },
        },
        {
          path: 'posts/:id/edit',
          name: 'post-edit',
          component: PostEdit,
          meta: { title: '编辑文章', group: '内容管理' },
        },
      ],
    },
  ],
});
