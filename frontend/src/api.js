import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000', // backendURL
  withCredentials: true, // Lo usamos con HTTPONLY. (seguridad)
})

// Configurar el token si ya existe en localStorage (por si el usuario ya estaba logueado)
const storedToken = localStorage.getItem('access_token')
if (storedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config || {}

    // Si es 401 y no hemos intentado refrescar aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      // No intentar refrescar si es el endpoint de refresh o login
      if (originalRequest.url?.includes('/auth/refresh') || 
          originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/register')) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        // Intentar refrescar el token usando la cookie HttpOnly
        const res = await api.post('/auth/refresh')
        const newAccessToken = res.data.access_token
        
        if (newAccessToken) {
          localStorage.setItem('access_token', newAccessToken)
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          
          // Reintentar la petición original con el nuevo token
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Si el refresh falla, limpiar el token y redirigir a login
        console.error('Error al refrescar token:', refreshError)
        localStorage.removeItem('access_token')
        delete api.defaults.headers.common['Authorization']
        
        // Si estamos en el navegador, redirigir a login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  },
)

// Interceptor de request para asegurar que el token se envía en cada petición
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // Asegurar que el token se envía siempre, sobrescribiendo cualquier valor anterior
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
      // También configurar en defaults para futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)
