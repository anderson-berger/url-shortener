import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Login na raiz
  {
    path: '/',
    component: () => import('pages/AuthPage.vue'),
  },

  // Área autenticada
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/MenuPage.vue'),
      },
      {
        path: 'health',
        component: () => import('pages/HealthCheckPage.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
