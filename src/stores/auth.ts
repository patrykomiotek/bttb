import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const username = ref<string | null>(null)
  const token = ref<string | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => token.value !== null)

  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    const result = await loginApi(email, password)
    loading.value = false
    if (!result.ok) {
      error.value = result.error.message
      return false
    }
    username.value = result.data.username
    token.value = result.data.token
    return true
  }

  function logout() {
    username.value = null
    token.value = null
    error.value = null
  }

  return { username, token, error, loading, isLoggedIn, login, logout }
})
