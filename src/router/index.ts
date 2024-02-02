import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from '@/views/HomeView.vue';
import About from '@/views/AboutView.vue';
import Manage from '@/views/ManageView.vue';

import useUserStore from '@/stores/user';

const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'about',
    path: '/about',
    component: About,
  },
  {
    name: 'manage',
    path: '/manage',
    component: Manage,
    beforeEnter: () => {
      const userStore = useUserStore();
      if (!userStore.userLoggedIn) {
        return { name: 'home' };
      }
    },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

export default router;
