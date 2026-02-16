import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Landing from '../views/Landing.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing,
    },
    {
      path: '/dashboard',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: () => import('../views/Configuracion.vue'),
    },
    {
      path: '/actividades',
      name: 'actividades',
      component: () => import('../views/Actividades.vue'),
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/Usuarios.vue'),
    },
    {
      path: '/proyectos',
      name: 'proyectos',
      component: () => import('../views/Proyectos.vue'),
    },
    {
      path: '/mensajeria',
      name: 'mensajeria',
      component: () => import('../views/Mensajeria.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Solo inicializar si no se ha hecho ya, para evitar llamadas redundantes al API en cada navegación
  if (!auth.isInitialized) {
    await auth.init()
  }

  // Public routes
  if (to.name === 'landing') {
    if (auth.isAuthenticated && auth.isAdmin) {
      // If admin tries to go to landing, redirect to dashboard
      return next({ name: 'home' })
    }
    return next()
  }

  // Protected routes
  if (!auth.isAuthenticated) {
    return next({ name: 'landing' })
  }

  // Admin only routes (everything else basically)
  if (auth.isAuthenticated && !auth.isAdmin) {
    // Non-admin logged in users stay on landing (or a user-specific dashboard if we had one)
    return next({ name: 'landing' })
  }

  return next()
})

export default router
