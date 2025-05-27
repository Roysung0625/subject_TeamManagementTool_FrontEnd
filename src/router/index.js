import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/views/LoginForm.vue'
import RegisterForm from '@/views/RegisterForm.vue'
import Dashboard from '@/views/DashBoard.vue'
import TeamTasksDetail from '@/views/TeamTasksDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterForm
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/teamtasks',
    name: 'TeamTasksDetail',
    component: TeamTasksDetail,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 라우트 가드
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 인증이 필요한 페이지
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // 게스트만 접근 가능한 페이지 (로그인된 사용자는 대시보드로)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router 