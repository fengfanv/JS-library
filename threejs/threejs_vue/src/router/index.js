import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/demo33' },
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
  },
  {
    path: '/demo17',
    name: 'demo17',
    component: () => import('../views/demo17.vue')
  },
  {
    path: '/demo18',
    name: 'demo18',
    component: () => import('../views/demo18.vue')
  },
  {
    path: '/demo19',
    name: 'demo19',
    component: () => import('../views/demo19.vue')
  },
  {
    path: '/demo20',
    name: 'demo20',
    component: () => import('../views/demo20.vue')
  },
  {
    path: '/demo21',
    name: 'demo21',
    component: () => import('../views/demo21.vue')
  },
  {
    path: '/demo22',
    name: 'demo22',
    component: () => import('../views/demo22.vue')
  },
  {
    path: '/demo23',
    name: 'demo23',
    component: () => import('../views/demo23.vue')
  },
  {
    path: '/demo24',
    name: 'demo24',
    component: () => import('../views/demo24.vue')
  },
  {
    path: '/demo25',
    name: 'demo25',
    component: () => import('../views/demo25.vue')
  },
  {
    path: '/demo26',
    name: 'demo26',
    component: () => import('../views/demo26.vue')
  },
  {
    path: '/demo27',
    name: 'demo27',
    component: () => import('../views/demo27.vue')
  },
  {
    path: '/demo28',
    name: 'demo28',
    component: () => import('../views/demo28.vue')
  },
  {
    path: '/demo29',
    name: 'demo29',
    component: () => import('../views/demo29.vue')
  },
  {
    path: '/demo30',
    name: 'demo30',
    component: () => import('../views/demo30.vue')
  },
  {
    path: '/demo31',
    name: 'demo31',
    component: () => import('../views/demo31.vue')
  },
  {
    path: '/demo32',
    name: 'demo32',
    component: () => import('../views/demo32.vue')
  },
  {
    path: '/demo33',
    name: 'demo33',
    component: () => import('../views/demo33.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
