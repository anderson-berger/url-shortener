import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Login na raiz
  {
    path: '/',
    name: 'auth',
    component: () => import('pages/AuthPage.vue'),
  },

  // Área autenticada
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    name: 'app',
    children: [
      {
        path: '',
        name: 'main',
        component: () => import('pages/MenuPage.vue'),
      },
    ],
  },

  // Redirect shortlink (deve vir antes do catchAll)
  {
    path: '/:shortCode([a-zA-Z0-9_-]{6})',
    name: 'redirect',
    component: () => import('pages/RedirectPage.vue'),
  },

  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
