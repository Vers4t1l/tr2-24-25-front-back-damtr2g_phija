import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const userRole = ref(null) // 'CENTER', 'ADMIN', 'PROFESSOR'
  const userName = ref(null)
  const userEmail = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)

  const setUserRole = (role) => {
    userRole.value = role
  }

  const setUserName = (name) => {
    userName.value = name
  }

  const login = (role, name, authToken, email) => {
    userRole.value = role
    userName.value = name
    userEmail.value = email
    token.value = authToken
    isAuthenticated.value = true
    
    // Persist to localStorage
    localStorage.setItem('userRole', role)
    localStorage.setItem('userName', name)
    localStorage.setItem('userEmail', email)
    localStorage.setItem('token', authToken)
  }

  const logout = () => {
    userRole.value = null
    userName.value = null
    userEmail.value = null
    token.value = null
    isAuthenticated.value = false
    
    // Clear localStorage
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('token')
  }

  const restoreSession = () => {
    const savedRole = localStorage.getItem('userRole')
    const savedName = localStorage.getItem('userName')
    const savedEmail = localStorage.getItem('userEmail')
    const savedToken = localStorage.getItem('token')
    
    if (savedRole && savedName && savedEmail && savedToken) {
      login(savedRole, savedName, savedToken, savedEmail)
    }
  }

  const isTokenValid = computed(() => {
    return token.value && isAuthenticated.value
  })

  const getAuthHeader = computed(() => {
    return token.value ? `Bearer ${token.value}` : null
  })

  return {
    userRole,
    userName,
    userEmail,
    token,
    isAuthenticated,
    isTokenValid,
    getAuthHeader,
    setUserRole,
    setUserName,
    login,
    logout,
    restoreSession,
  }
})
