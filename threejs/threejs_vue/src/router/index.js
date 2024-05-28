import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/demo2' },
  {
    path: '/',
    name: 'demo1',
    component: () => import('../views/demo1.vue')
  },
  {
    path: '/demo2',
    name: 'demo2',
    component: () => import('../views/demo2.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
