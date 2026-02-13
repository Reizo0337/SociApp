import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/no-access',
      name: 'no-access',
      component: () => import('../views/NoAccess.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Siempre recargar usuario desde backend para detectar cambios de rol en DB
  // Esto permite que si un admin cambia a usuario en la DB, al hacer F5 se actualice
  await auth.init()

  const publicRouteNames = ['login', 'register']
  const isPublic = publicRouteNames.includes((to.name as string) || '')

  // Si no está autenticado y la ruta no es pública, lo mandamos a login
  if (!auth.isAuthenticated && !isPublic) {
    return next({ name: 'login' })
  }

  // Si está autenticado y quiere ir a login/register, lo redirigimos según su rol
  if (auth.isAuthenticated && isPublic) {
    if (auth.isAdmin) {
      return next({ name: 'home' })
    } else {
      return next({ name: 'no-access' })
    }
  }

  // Si está autenticado pero NO es admin, sólo puede ver la pantalla de texto
  if (auth.isAuthenticated && !auth.isAdmin && to.name !== 'no-access') {
    return next({ name: 'no-access' })
  }

  return next()
})

export default router
