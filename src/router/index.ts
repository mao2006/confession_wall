import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import login_page from '@/views/login_page.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/login',
      name:'login',
      component:login_page,
    }
  ]
})



export default router
