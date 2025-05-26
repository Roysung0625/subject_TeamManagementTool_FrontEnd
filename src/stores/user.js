import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      name: '홍길동',
      role: '팀 리더',
      avatar: '/avatars/default.png'
    }
  }),
  
  getters: {
    getUserInfo: (state) => state.user
  },
  
  actions: {
    updateUserInfo(userInfo) {
      this.user = { ...this.user, ...userInfo }
    }
  }
}) 