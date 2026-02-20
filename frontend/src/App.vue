<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Menu from './components/Menu.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import NotificationHost from './components/NotificationHost.vue'
import { useAuthStore } from './stores/auth'

const route = useRoute()

const isMenuExpanded = ref(false)
const auth = useAuthStore()

const showLogin = ref(false)
const showRegister = ref(false)

const handleToggleMenu = (expanded: boolean) => {
  isMenuExpanded.value = expanded
}

const openLogin = () => {
  showRegister.value = false
  showLogin.value = true
}

const openRegister = () => {
  showLogin.value = false
  showRegister.value = true
}

onMounted(() => {
  auth.init()
})

const mainContentClass = computed(() => {
  if (auth.isAuthenticated && auth.isAdmin) {
    return isMenuExpanded.value ? 'expanded' : 'collapsed'
  }
  return 'full-width'
})

const isNotHome = computed(() => {
  return route.path !== '/' && route.path !== '/dashboard'
})
</script>

<template>
  <Menu 
    @toggle-menu="handleToggleMenu" 
    @open-login="openLogin"
    @open-register="openRegister"
  />
  
  <div class="main-content" :class="mainContentClass">
    <RouterView />
  </div>

  <Transition name="fade">
    <LoginModal 
      v-if="showLogin" 
      @close="showLogin = false" 
      @switch-to-register="openRegister" 
    />
  </Transition>

  <Transition name="fade">
    <RegisterModal 
      v-if="showRegister" 
      @close="showRegister = false" 
      @switch-to-login="openLogin" 
    />
  </Transition>

  <RouterLink v-if="isNotHome" to="/dashboard" class="floating-home-btn" title="Ir al Panel Principal">
    <span class="material-symbols-outlined">home</span>
  </RouterLink>

  <NotificationHost />
</template>

<style scoped>
.main-content {
  margin-top: 60px;
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
}

.main-content.collapsed {
  margin-left: 90px;
}

.main-content.expanded {
  margin-left: 270px;
}

.main-content.full-width {
  margin-left: 0;
}

@media (max-width: 768px) {
  .main-content.collapsed,
  .main-content.expanded {
    margin-left: 0;
  }
  .main-content {
    padding-bottom: 75px; /* Espacio para el menú inferior */
  }
}

.main-content {
  overflow-x: hidden;
  max-width: 100vw;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.floating-home-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 50px;
  height: 50px;
  background: var(--button-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
}

.floating-home-btn:hover {
  transform: scale(1.1) rotate(-10deg);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  background: var(--button-primary-hover);
}

.floating-home-btn .material-symbols-outlined {
  font-size: 24px;
}

@media (max-width: 768px) {
  .floating-home-btn {
    bottom: 85px; /* Subirlo para que no tape el menú */
    right: 20px;
    width: 44px;
    height: 44px;
  }
}
</style>
