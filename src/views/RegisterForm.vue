<template lang="pug">
.register-form
  .form-container
    h2 회원가입
    
    form(@submit.prevent="handleRegister")
      FormInput(
        id="name"
        v-model="userData.name"
        type="text"
        label="이름"
        placeholder="이름을 입력하세요"
        :required="true"
        :disabled="authStore.isLoading"
      )
      
      FormInput(
        id="password"
        v-model="userData.password"
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        :required="true"
        :disabled="authStore.isLoading"
      )
      
      FormInput(
        id="confirmPassword"
        v-model="userData.confirmPassword"
        type="password"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력하세요"
        :required="true"
        :disabled="authStore.isLoading"
      )
      
      
      ErrorMessage(
        :message="authStore.error || validationError"
        variant="error"
        :closable="true"
        @close="clearErrors"
      )
      
      .form-actions
        BaseButton(
          type="submit"
          variant="success"
          :disabled="!isFormValid"
          :loading="authStore.isLoading"
          loading-text="가입 중..."
          full-width
        ) 회원가입
        
        BaseButton(
          type="button"
          variant="secondary"
          :disabled="authStore.isLoading"
          full-width
          @click="goToLogin"
        ) 로그인으로 돌아가기
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

// 라우터와 스토어 사용
const router = useRouter()
const authStore = useAuthStore()

// 회원가입 폼 데이터
const userData = ref({
  name: '',
  password: '',
  confirmPassword: ''
})

// 유효성 검사 에러
const validationError = ref('')

// 폼 유효성 검사
const isFormValid = computed(() => {
  const { name, password, confirmPassword } = userData.value
  return name && password && confirmPassword && !validationError.value
})

// 비밀번호 확인 검사
const passwordsMatch = computed(() => {
  return userData.value.password === userData.value.confirmPassword
})

// 유효성 검사
function validateForm() {
  validationError.value = ''
  
  if (userData.value.password.length < 4) {
    validationError.value = '비밀번호는 최소 4자 이상이어야 합니다.'
    return false
  }
  
  if (!passwordsMatch.value) {
    validationError.value = '비밀번호가 일치하지 않습니다.'
    return false
  }
  
  return true
}

// 회원가입 처리
// eslint-disable-next-line no-unused-vars
async function handleRegister() {
  if (!isFormValid.value || !validateForm()) return
  
  try {
    authStore.setLoading(true)
    authStore.clearError()
    
    // confirmPassword 제거 후 전송
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...registerData } = userData.value
    
    // authService를 직접 호출
    await authService.register(registerData)
    
    console.log('회원가입 성공')
    
    // 폼 초기화
    userData.value = {
      name: '',
      password: '',
      confirmPassword: ''
    }
    
    // Dashboard 페이지로 이동
    router.push('/dashboard')
    
  } catch (error) {
    console.error('회원가입 실패:', error)
    authStore.setError(error.message || '회원가입에 실패했습니다.')
  } finally {
    authStore.setLoading(false)
  }
}

// 로그인 페이지로 이동
// eslint-disable-next-line no-unused-vars
function goToLogin() {
  router.push('/login')
}

// 에러 메시지 초기화
// eslint-disable-next-line no-unused-vars
function clearErrors() {
  authStore.clearError()
  validationError.value = ''
}
</script>

<style scoped>
.register-form {
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