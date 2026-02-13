import { defineStore } from 'pinia'
import { api } from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('access_token') || null,
    isInitialized: false,
  }),

  getters: {
    isAuthenticated: state => !!state.accessToken && !!state.user,
    // Verificar si es administrador (acepta 'monitor', 'admin', 'administrador')
    isAdmin: state => {
      const categoria = state.user?.categoria?.toLowerCase();
      return categoria === 'monitor' || categoria === 'admin' || categoria === 'administrador';
    },
  },

  actions: {
    setAccessToken(token) {
      this.accessToken = token

      if (token) {
        localStorage.setItem('access_token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        localStorage.removeItem('access_token')
        delete api.defaults.headers.common['Authorization']
      }
    },

    async init() {
      // Siempre recargar el usuario desde el backend si hay token
      // Esto permite detectar cambios de rol en la DB sin necesidad de logout/login
      if (this.accessToken) {
        api.defaults.headers.common['Authorization'] =
          `Bearer ${this.accessToken}`
        try {
          await this.fetchCurrentUser()
        } catch (error) {
          // Si falla (token inválido/expirado), limpiamos sesión
          this.user = null
          this.setAccessToken(null)
        }
      }

      // Marcar como inicializado solo la primera vez para evitar múltiples llamadas simultáneas
      if (!this.isInitialized) {
        this.isInitialized = true
      }
    },

    async fetchCurrentUser() {
      const res = await api.get('/auth/me')
      this.user = res.data
      return this.user
    },

    async register(payload) {
      const res = await api.post('/auth/register', payload)
      if (res.data?.access_token) {
        this.setAccessToken(res.data.access_token)
        await this.fetchCurrentUser()
      }
      return res.data
    },

    async login(payload) {
      const res = await api.post('/auth/login', payload)
      if (res.data?.access_token) {
        this.setAccessToken(res.data.access_token)
        await this.fetchCurrentUser()
      }
      return res.data
    },

    async logout() {
      try {
        await api.post('/auth/logout')
      } catch {
        // ignorar errores de logout
      }
      this.user = null
      this.setAccessToken(null)

      // Force redirect to landing page
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    },
  },
})
