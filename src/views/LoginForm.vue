<template lang="pug">
.login-form
  .form-container
    h2 로그인
    
    //.prevent => action 수행 후, 새로고침을 막는다
    form(@submit.prevent="handleLogin")
      FormInput(
        id="employee_id"
        v-model="credentials.employee_id"
        label="사번"
        placeholder="사번을 입력하세요"
        :required="true"
        :disabled="authStore.isLoading"
      )
      
      FormInput(
        id="password"
        v-model="credentials.password"
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        :required="true"
        :disabled="authStore.isLoading"
      )
      
      ErrorMessage(
        :message="authStore.error"
        variant="error"
        :closable="true"
        @close="authStore.clearError"
      )
      
      .form-actions
        BaseButton(
          type="submit"
          variant="primary"
          :disabled="!isFormValid"
          :loading="authStore.isLoading"
          full-width
        ) 로그인
        
        BaseButton(
          type="button"
          variant="secondary"
          :disabled="authStore.isLoading"
          full-width
          @click="goToRegister"
        ) 회원가입
    
    UserInfo(
      v-if="authStore.isAuthenticated"
      :user="authStore.user"
      title="로그인 정보"
      @logout="handleLogout"
    )
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import authService from '@/services/authService'
// eslint-disable-next-line no-unused-vars
import FormInput from '@/components/common/FormInput.vue'
// eslint-disable-next-line no-unused-vars
import BaseButton from '@/components/common/BaseButton.vue'
// eslint-disable-next-line no-unused-vars
import ErrorMessage from '@/components/common/ErrorMessage.vue'
// eslint-disable-next-line no-unused-vars
import UserInfo from '@/components/auth/UserInfo.vue'

// 라우터와 스토어 사용
const router = useRouter()
const authStore = useAuthStore()

// 로그인 폼 데이터
const credentials = ref({
  employee_id: '',
  password: ''
})

// 폼 유효성 검사
const isFormValid = computed(() => {
  return credentials.value.employee_id && credentials.value.password
})

// 로그인 처리
// eslint-disable-next-line no-unused-vars
async function handleLogin() {
  if (!isFormValid.value) return
  
  try {
    authStore.setLoading(true)
    authStore.clearError()
    
    // authService를 직접 호출
    const response = await authService.login(credentials.value)
    
    // 로그인 성공 시 authStore에 데이터 저장
    authStore.setAuthData(response)
    
    console.log('로그인 성공:', authStore.user)
    await router.push('/dashboard')
    
  } catch (error) {
    console.error('로그인 실패:', error)
    authStore.setError(error.message || '로그인에 실패했습니다.')
  } finally {
    authStore.setLoading(false)
  }
}

// 회원가입 페이지로 이동
// eslint-disable-next-line no-unused-vars
function goToRegister() {
  router.push('/register')
}

// 로그아웃 처리
// eslint-disable-next-line no-unused-vars
async function handleLogout() {
  try {
    authStore.setLoading(true)
    
    // authService를 직접 호출
    await authService.logout()
    
    // authStore 상태 초기화
    authStore.clearAuthData()
    
    console.log('로그아웃 완료')
    
    // 폼 초기화
    credentials.value = {
      email: '',
      password: ''
    }
    
  } catch (error) {
    console.error('로그아웃 실패:', error)
    // 로그아웃은 실패해도 로컬 상태는 정리
    authStore.clearAuthData()
  } finally {
    authStore.setLoading(false)
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}
</style> 