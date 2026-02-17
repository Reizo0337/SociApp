<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import logo from '@/assets/logo.png'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['toggle-menu', 'open-login', 'open-register'])
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
  router.push({ name: 'landing' })
}

const toggleMenu = () => {
  isPinned.value = !isPinned.value
  isOpen.value = isPinned.value
  emit('toggle-menu', isOpen.value)
}

const handleMouseEnter = () => {
  if (window.innerWidth > 768 && !isPinned.value) {
    isOpen.value = true
    emit('toggle-menu', true)
  }
}

const handleMouseLeave = () => {
  if (window.innerWidth > 768 && !isPinned.value) {
    isOpen.value = false
    emit('toggle-menu', false)
  }
}
</script>

<template>
  <header>
    <div class="header">
      <button class="menu-toggle" @click="toggleMenu" v-if="auth.isAuthenticated && auth.isAdmin">
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
        <button @click="$emit('open-login')" class="auth-link-btn">
          Login
        </button>
        <button @click="$emit('open-register')" class="auth-btn-primary">
          Register
        </button>
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
    v-if="auth.isAuthenticated && auth.isAdmin"
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
        <li>
          <RouterLink to="/mensajeria" class="nav-link">
            <span class="material-symbols-outlined icon"> mail </span>
            <span class="text" v-show="isOpen">Mensajería</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>

  <!-- Overlay para cerrar el menú en móvil -->
  <div 
    v-if="isOpen && auth.isAuthenticated && auth.isAdmin" 
    class="sidebar-overlay" 
    @click="toggleMenu"
  ></div>
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
  padding: 0 13px;
  z-index: 1003;
  border-bottom: 1px solid var(--border-color);
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
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

@media (max-width: 768px) {
  .sidebar {
    width: 0;
    padding: 0;
    border: none;
  }
  .sidebar.is-open {
    width: 250px;
    padding: 20px 10px;
    box-shadow: 4px 0 15px rgba(0,0,0,0.1);
  }
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
  font-size: 1.5rem;
}

.logo-wrapper img {
  width: 70px;
  height: auto;
}

@media (max-width: 768px) {
  .logo-text {
    display: none;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-primary);
  transition: background-color 0.2s ease;
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

.auth-link-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 0.95rem;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.3s ease;
}

.auth-link-btn:hover {
  background-color: var(--button-secondary);
}

.auth-btn-primary {
  background: var(--button-primary);
  color: white;
  border: none;
  font-size: 0.95rem;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.auth-btn-primary:hover {
  background: var(--button-primary-hover);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto;
  margin-right: 20px;
}

@media (max-width: 768px) {
  .welcome-text {
    display: none;
  }
  .user-info {
    margin-right: 10px;
    gap: 10px;
  }
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

.nav-link:hover {
  background-color: var(--button-secondary);
  border-radius: 30px;
}

.menu-toggle:hover {
  background-color: var(--button-secondary);
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

.sidebar-overlay {
  display: none;
}

@media (max-width: 768px) {
  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1001;
    backdrop-filter: blur(2px);
  }
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
