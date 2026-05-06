import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '主页' },
  },
  {
    path: '/single',
    name: 'single',
    component: () => import('@/views/SingleDrawView.vue'),
    meta: { title: '单张抽牌' },
  },
  {
    path: '/three',
    name: 'three',
    component: () => import('@/views/ThreeCardsView.vue'),
    meta: { title: '三牌阵' },
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/HistoryView.vue'),
    meta: { title: '历史记录' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

// 用 hash 模式，部署到 Vercel/GitHub Pages 之类的子路径都不会 404
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = '夜行卡牌'
  document.title = to.meta?.title ? `${to.meta.title} · ${base}` : base
})
