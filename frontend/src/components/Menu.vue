<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import logo from '@/assets/logo.png'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['toggle-menu'])
const router = useRouter()
const auth = useAuthStore()

const isOpen = ref(false)
const isPinned = ref(false)

const userName = computed(() => {
  if (auth.user?.nombre && auth.user?.apellidos) {
    return `${auth.user.nombre} ${auth.user.apellidos}`
  }
  return auth.user?.nombre || auth.user?.email || 'Usuario'
})

const handleLogout = async () => {
  await auth.logout()
  router.push({ name: 'login' })
}

const toggleMenu = () => {
  isPinned.value = !isPinned.value
  isOpen.value = isPinned.value
  emit('toggle-menu', isOpen.value)
}

const handleMouseEnter = () => {
  if (!isPinned.value) {
    isOpen.value = true
    emit('toggle-menu', true)
  }
}

const handleMouseLeave = () => {
  if (!isPinned.value) {
    isOpen.value = false
    emit('toggle-menu', false)
  }
}
</script>

<template>
  <header>
    <div class="header">
      <button class="menu-toggle" @click="toggleMenu">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <RouterLink to="/" class="logo-wrapper">
        <div class="logo-wrapper">
          <img :src="logo" alt="Logo" class="logo-icon" />
          <p class="logo-text">Sociapp</p>
        </div>
      </RouterLink>

      <!-- Si no está logueado: mostrar Login y Register -->
      <div v-if="!auth.isAuthenticated" class="auth-buttons">
        <RouterLink to="/login" class="auth-link">
          <p>Login</p>
        </RouterLink>
        <RouterLink to="/register" class="auth-link">
          <p>Register</p>
        </RouterLink>
      </div>

      <!-- Si está logueado: mostrar toggle, bienvenida y logout -->
      <div v-else class="user-info">
        <ToggleSwitch class="theme-toggle-small" />
        <span class="welcome-text">Bienvenido, {{ userName }}</span>
        <button @click="handleLogout" class="logout-btn" title="Cerrar sesión">
          <span class="material-symbols-outlined">logout</span>
        </button>
      </div>
    </div>
  </header>
  <aside
    class="sidebar"
    :class="{ 'is-open': isOpen }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <nav class="sidebar-nav">
      <ul>
        <li>
          <RouterLink to="/configuracion" class="nav-link">
            <span class="material-symbols-outlined icon">
              settings_account_box
            </span>
            <span class="text" v-show="isOpen">Configuración</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/usuarios" class="nav-link">
            <span class="material-symbols-outlined icon"> group </span>
            <span class="text" v-show="isOpen">Usuarios</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/actividades" class="nav-link">
            <span class="material-symbols-outlined icon"> task </span>
            <span class="text" v-show="isOpen">Actividades</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/proyectos" class="nav-link">
            <span class="material-symbols-outlined icon"> work </span>
            <span class="text" v-show="isOpen">Proyectos</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 1003;
  border-bottom: 1px solid var(--border-color);
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.sidebar .header .menu-toggle {
  transition: background 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.menu-toggle span {
  margin-left: 3px;
}

.close {
  margin-top: 10px;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 70px;
  height: 100vh;
  background: var(--bg-secondary);
  transition:
    width 0.3s ease-in-out,
    background-color 0.3s ease,
    border-color 0.3s ease;
  z-index: 1002;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  white-space: nowrap;
  margin-top: 40px;
  border-right: 1px solid var(--border-color);
}

.sidebar.is-open {
  width: 250px;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  min-height: 40px;
  gap: 15px;
}

.sidebar.is-open .sidebar-header {
  flex-direction: row;
  justify-content: space-between;
  gap: 0;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 1.3rem;
}

.logo-wrapper img {
  width: 100px;
  height: auto;
}

.logo-icon {
  font-size: 2rem;
  color: var(--text-primary);
}

.logo-text {
  font-weight: thin;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-primary);
}

.theme-toggle-small {
  transform: scale(0.75);
  margin-right: 10px;
}

.auth-buttons {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-left: auto;
  margin-right: 20px;
}

.auth-link {
  text-decoration: none;
  color: var(--text-primary);
  font-size: 0.95rem;
  padding: 8px 16px;
  border-radius: 6px;
  transition:
    background-color 0.2s,
    color 0.3s ease;
}

.auth-link:hover {
  background-color: var(--button-secondary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto;
  margin-right: 20px;
}

.welcome-text {
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 500;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-primary);
  transition:
    opacity 0.2s,
    transform 0.2s;
  border-radius: 50%;
  width: 36px;
  height: 36px;
}

.logout-btn:hover {
  opacity: 0.7;
  transform: scale(1.1);
  background-color: var(--button-secondary);
}

.logout-btn .material-symbols-outlined {
  font-size: 1.5rem;
}

.sidebar-nav {
  margin-top: 20px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
}

.sidebar-nav li {
  margin-bottom: 15px;
}

.nav-link {
  text-decoration: none;
  color: var(--text-primary);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  transition:
    background 0.2s,
    color 0.3s ease;
}

.nav-link:hover,
.menu-toggle:hover {
  background-color: var(--button-secondary);
  border-radius: 30px;
}

.nav-link.router-link-active {
  background-color: #e1e8ff;
  color: #2a4ea2;
  border-radius: 30px;
}

:global(.dark) .nav-link.router-link-active {
  background-color: rgba(42, 78, 162, 0.2);
  color: #60a5fa;
}

.icon {
  font-size: 1.5rem;
  min-width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
</style>
