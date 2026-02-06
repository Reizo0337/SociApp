<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <aside class="sidebar" :class="{ 'is-open': isOpen }">
    <div class="sidebar-header">
      <div class="logo-wrapper">
        <span class="material-symbols-outlined logo-icon">spa</span>
        <h2 class="logo-text" v-show="isOpen">SociApp</h2>
      </div>
      <button class="menu-toggle" @click="toggleMenu">
        <span class="material-symbols-outlined" v-show="!isOpen">menu</span>
        <span class="material-symbols-outlined close" v-show="isOpen">close</span>
      </button>
    </div>

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
            <span class="material-symbols-outlined icon">
                group
            </span>
            <span class="text" v-show="isOpen">Usuarios</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/actividades" class="nav-link">
            <span class="material-symbols-outlined icon">
                task
            </span>
            <span class="text" v-show="isOpen">Actividades</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/proyectos" class="nav-link">
            <span class="material-symbols-outlined icon">
                work
            </span>
            <span class="text" v-show="isOpen">Proyectos</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.close {
  margin-top: 10px;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 70px; 
  height: 100vh;
  background: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease-in-out;
  z-index: 1002;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  white-space: nowrap;
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
  display:flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 10px;
}

.logo-icon {
  font-size: 2rem;
  color: #333;
}

.logo-text {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
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

.nav-link:hover {
  background-color: #f4f4f4;
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
