import { defineStore } from 'pinia'
import { ref } from 'vue'
interface UserInfo {
  username: string
}
export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo|null>(null)
  const setToken = (newToken: string) => {
    console.log('newToken',newToken)
    token.value = newToken
    localStorage.setItem('token', newToken) // 同步到持久化存储
  }
  const clearToken = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }
  return {
    token,
    userInfo,
    setToken,
    clearToken
  }
})
