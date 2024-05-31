import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/demo4' },
  {
    path: '/demo1',
    name: 'demo1',
    component: () => import('../views/demo1.vue')
  },
  {
    path: '/demo2',
    name: 'demo2',
    component: () => import('../views/demo2.vue')
  },
  {
    path: '/demo3',
    name: 'demo3',
    component: () => import('../views/demo3.vue')
  },
  {
    path: '/demo4',
    name: 'demo4',
    component: () => import('../views/demo4.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
