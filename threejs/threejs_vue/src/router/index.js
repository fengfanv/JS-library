import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/demo16' },
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
  },
  {
    path: '/demo5',
    name: 'demo5',
    component: () => import('../views/demo5.vue')
  },
  {
    path: '/demo6',
    name: 'demo6',
    component: () => import('../views/demo6.vue')
  },
  {
    path: '/demo7',
    name: 'demo7',
    component: () => import('../views/demo7.vue')
  },
  {
    path: '/demo8',
    name: 'demo8',
    component: () => import('../views/demo8.vue')
  },
  {
    path: '/demo9',
    name: 'demo9',
    component: () => import('../views/demo9.vue')
  },
  {
    path: '/demo10',
    name: 'demo10',
    component: () => import('../views/demo10.vue')
  },
  {
    path: '/demo11',
    name: 'demo11',
    component: () => import('../views/demo11.vue')
  },
  {
    path: '/demo12',
    name: 'demo12',
    component: () => import('../views/demo12.vue')
  },
  {
    path: '/demo13',
    name: 'demo13',
    component: () => import('../views/demo13.vue')
  },
  {
    path: '/demo14',
    name: 'demo14',
    component: () => import('../views/demo14.vue')
  },
  {
    path: '/demo15',
    name: 'demo15',
    component: () => import('../views/demo15.vue')
  },
  {
    path: '/demo16',
    name: 'demo16',
    component: () => import('../views/demo16.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
