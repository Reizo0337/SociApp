<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import logo from '@/assets/logo.png'
const emit = defineEmits(['toggle-menu'])

const isOpen = ref(false)
const isPinned = ref(false)

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
      </div>
    </header>
  <aside class="sidebar" :class="{ 'is-open': isOpen }" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
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
  background: #f8fafd;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 1003;
}

.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: #f8fafd;
  z-index: -1;
}

.sidebar .header .menu-toggle {
  transition: background 0.2s ease;
  cursor: pointer;
  margin-left:8px;
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
  background: #f8fafd;
  transition: width 0.3s ease-in-out;
  z-index: 1002;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  white-space: nowrap;
  margin-top: 40px;
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
  color: #333;
  font-size: 1.3rem;
}

.logo-wrapper img {
  width: 100px;
  height: auto;
}

.logo-icon {
  font-size: 2rem;
  color: #333;
}

.logo-text {
  font-weight: thin;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #333;
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
  color: #333;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-link:hover, .menu-toggle:hover {
  background-color: #f4f4f4;
  border-radius: 30px;
}

.icon {
  font-size: 1.5rem;
  min-width: 30px;
  display: flex;
  justify-content: center;
  margin-right: 15px;
  margin-left: 10px;
}
</style>
