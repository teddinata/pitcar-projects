import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import apiClient from '../config/api'
import { useOneSignal } from '../composables/useOneSignal'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  
  const { setExternalId, unsubscribe } = useOneSignal()

  // Listen for storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'uid' && !e.newValue) {
      logout()
    }
  })

  const login = async (database, email, password) => {
    try {
      const payload = {
        jsonrpc: '2.0',
        id: new Date().getTime(),
        params: {
          db: database,
          login: email,
          password: password
        }
      }
  
      console.log('📡 Login attempt:', {
        database,
        email,
        timestamp: new Date().toISOString()
      })
  
      const response = await apiClient.post('/web/session/authenticate', payload)

      const sessionId = response.headers['x-openerp-session-id']
      if (sessionId) {
        localStorage.setItem('sessionId', sessionId)
      }

      if (response.data.error) {
        throw new Error(response.data.error.data?.message || 'Authentication failed')
      }

      const userData = response.data.result
      user.value = userData
      isAuthenticated.value = true

      // Store essential data in localStorage
      localStorage.setItem('uid', userData.uid)
      localStorage.setItem('user_context', JSON.stringify(userData.user_context))
      localStorage.setItem('username', userData.username)
      localStorage.setItem('name', userData.name)
      localStorage.setItem('company_id', userData.company_id)
      localStorage.setItem('partner_id', userData.partner_id)
      localStorage.setItem('database', database)
      localStorage.setItem('isAdmin', userData.is_admin)

      // Initialize OneSignal user integration
      try {
        setExternalId(String(userData.uid))
      } catch (err) {
        console.error('OneSignal mapping error:', err)
      }

      return userData
    } catch (error) {
      console.error('❌ Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.post('/web/session/destroy', {})
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Logout from OneSignal
      try {
        unsubscribe()
      } catch (err) {}

      user.value = null
      isAuthenticated.value = false
      localStorage.clear()
      window.location.href = '/login'
    }
  }

  const checkAuth = () => {
    const uid = localStorage.getItem('uid')
    const username = localStorage.getItem('username')
    
    if (uid && username) {
      isAuthenticated.value = true
      user.value = {
        uid,
        username,
        name: localStorage.getItem('name'),
        company_id: localStorage.getItem('company_id'),
        partner_id: localStorage.getItem('partner_id'),
        is_admin: localStorage.getItem('isAdmin') === 'true'
      }

      // Ensure OneSignal stays synced
      try {
        setExternalId(String(uid))
      } catch (err) {}
    } else {
      user.value = null
      isAuthenticated.value = false
      localStorage.clear()
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
})
