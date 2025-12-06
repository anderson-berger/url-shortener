import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Login na raiz
  {
    path: '/',
    component: () => import('pages/AuthPage.vue'),
  },
  {
    path: '/:shortCode',
    component: () => import('pages/RedirectPage.vue'),
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
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
