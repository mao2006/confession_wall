import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import login_page from '@/views/login_page.vue'
import main_page from '@/views/main_page.vue'
import { login_store } from '@/stores/store';
import Register_page from '@/views/register_page.vue';
import { ref } from 'vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/login',
      name:'login',
      component:login_page,
    },
    {
      path:'/main',
      name:'main',
      component:main_page,
    },
    {
      path:'/register',
      name:'register',
      component:Register_page,
    }
  ]
})

router.beforeEach(
  (to,from,next)=>{
    const store_loginpage = login_store()

    if(to.path!='/login' && to.path!='/register' &&store_loginpage.login_status==false){
      console.log('111')
      next('/login')
    }else{
      console.log('222')
      next()
    }
  }
)
export default router
