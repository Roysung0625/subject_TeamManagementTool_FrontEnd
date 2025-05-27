<template lang="pug">
.login-form
  .form-container
    h2 ログイン
    
    //.prevent => action実行後、リフレッシュを防ぐ
    form(@submit.prevent="handleLogin")
      FormInput(
        id="employee_id"
        v-model="credentials.employee_id"
        label="社員番号"
        placeholder="社員番号を入力してください"
        :required="true"
        :disabled="authStore.isLoading"
      )
      
      FormInput(
        id="password"
        v-model="credentials.password"
        type="password"
        label="パスワード"
        placeholder="パスワードを入力してください"
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
        ) ログイン
        
        BaseButton(
          type="button"
          variant="secondary"
          :disabled="authStore.isLoading"
          full-width
          @click="goToRegister"
        ) 会員登録
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

// ルーターとストア使用
const router = useRouter()
const authStore = useAuthStore()

// ログインフォームデータ
const credentials = ref({
  employee_id: '',
  password: ''
})

// フォームバリデーション
const isFormValid = computed(() => {
  return credentials.value.employee_id && credentials.value.password
})

// ログイン処理
// eslint-disable-next-line no-unused-vars
async function handleLogin() {
  if (!isFormValid.value) return
  
  try {
    authStore.setLoading(true)
    authStore.clearError()
    
    // authServiceを直接呼び出し
    const response = await authService.login(credentials.value)
    
    // ログイン成功時authStoreにデータ保存
    authStore.setAuthData(response)
    
    console.log('ログイン成功:', authStore.user)
    await router.push('/dashboard')
    
  } catch (error) {
    console.error('ログイン失敗:', error)
    authStore.setError(error.message || 'ログインに失敗しました。')
  } finally {
    authStore.setLoading(false)
  }
}

// 会員登録ページに移動
// eslint-disable-next-line no-unused-vars
function goToRegister() {
  router.push('/register')
}

// ログアウト処理
// eslint-disable-next-line no-unused-vars
async function handleLogout() {
  try {
    authStore.setLoading(true)
    
    // authServiceを直接呼び出し
    await authService.logout()
    
    // authStore状態初期化
    authStore.clearAuthData()
    
    console.log('ログアウト完了')
    
    // フォーム初期化
    credentials.value = {
      email: '',
      password: ''
    }
    
  } catch (error) {
    console.error('ログアウト失敗:', error)
    // ログアウトは失敗してもローカル状態は整理
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