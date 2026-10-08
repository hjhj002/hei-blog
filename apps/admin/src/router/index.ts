import { createRouter, createWebHistory } from 'vue-router';
import PostList from '../views/PostList.vue';
import PostEdit from '../views/PostEdit.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: PostList },
    { path: '/posts/new', component: PostEdit },
    { path: '/posts/:id/edit', component: PostEdit },
  ],
});
