<template lang="pug">
.register-form
  .form-container
    h2 会員登録
    
    form(@submit.prevent="handleRegister")
      FormInput(
        id="name"
        v-model="userData.name"
        type="text"
        label="名前"
        placeholder="名前を入力してください"
        :required="true"
        :disabled="authStore.isLoading"
      )
      
      FormInput(
        id="password"
        v-model="userData.password"
        type="password"
        label="パスワード"
        placeholder="パスワードを入力してください"
        :required="true"
        :disabled="authStore.isLoading"
      )
      
      FormInput(
        id="confirmPassword"
        v-model="userData.confirmPassword"
        type="password"
        label="パスワード確認"
        placeholder="パスワードを再入力してください"
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
          loading-text="登録中..."
          full-width
        ) 会員登録
        
        BaseButton(
          type="button"
          variant="secondary"
          :disabled="authStore.isLoading"
          full-width
          @click="goToLogin"
        ) ログインに戻る
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

// ルーターとストア使用
const router = useRouter()
const authStore = useAuthStore()

// 会員登録フォームデータ
const userData = ref({
  name: '',
  password: '',
  confirmPassword: ''
})

// バリデーションエラー
const validationError = ref('')

// フォームバリデーション
const isFormValid = computed(() => {
  const { name, password, confirmPassword } = userData.value
  return name && password && confirmPassword && !validationError.value
})

// パスワード確認チェック
const passwordsMatch = computed(() => {
  return userData.value.password === userData.value.confirmPassword
})

// バリデーション
function validateForm() {
  validationError.value = ''
  
  if (userData.value.password.length < 4) {
    validationError.value = 'パスワードは最低4文字以上である必要があります。'
    return false
  }
  
  if (!passwordsMatch.value) {
    validationError.value = 'パスワードが一致しません。'
    return false
  }
  
  return true
}

// 会員登録処理
// eslint-disable-next-line no-unused-vars
async function handleRegister() {
  if (!isFormValid.value || !validateForm()) return
  
  try {
    authStore.setLoading(true)
    authStore.clearError()
    
    // confirmPassword削除後送信
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...registerData } = userData.value
    
    // authServiceを直接呼び出し
    await authService.register(registerData)
    
    console.log('会員登録成功')
    
    // フォーム初期化
    userData.value = {
      name: '',
      password: '',
      confirmPassword: ''
    }
    
    // Dashboardページに移動
    router.push('/dashboard')
    
  } catch (error) {
    console.error('会員登録失敗:', error)
    authStore.setError(error.message || '会員登録に失敗しました。')
  } finally {
    authStore.setLoading(false)
  }
}

// ログインページに移動
// eslint-disable-next-line no-unused-vars
function goToLogin() {
  router.push('/login')
}

// エラーメッセージ初期化
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