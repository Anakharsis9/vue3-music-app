import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import useUserStore from '@/stores/user';
import { start, done } from 'nprogress';

const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    name: 'about',
    path: '/about',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    name: 'song',
    path: '/song/:id',
    component: () => import('@/views/SongView.vue'),
  },
  {
    name: 'manage',
    path: '/manage',
    component: () => import('@/views/ManageView.vue'),
    meta: {
      requiredAuth: true,
    },
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

router.beforeEach(() => {
  start();
});

router.afterEach(() => done());

export default router;
