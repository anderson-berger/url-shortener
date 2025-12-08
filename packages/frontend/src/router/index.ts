// src/router/index.ts
import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const auth = localStorage.getItem('auth');
    const isAuthenticated = !!auth;

    if (to.path.startsWith('/app') && !isAuthenticated) {
      next('/');
    } else if (to.path === '/' && isAuthenticated) {
      next('/app');
    } else {
      next();
    }
  });

  return Router;
});
