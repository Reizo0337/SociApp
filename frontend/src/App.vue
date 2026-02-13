<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Menu from './components/Menu.vue'
import { useAuthStore } from './stores/auth'

const isMenuExpanded = ref(false)
const route = useRoute()
const auth = useAuthStore()

const handleToggleMenu = (expanded: boolean) => {
  isMenuExpanded.value = expanded
}

const isAuthRoute = computed(() => {
  return route.name === 'login' || route.name === 'register'
})

onMounted(() => {
  // Intentar recuperar sesión si había token guardado
  auth.init()
})
</script>

<template>
  <!-- Si no está logueado: sólo se muestran las vistas de login/register, sin menú -->
  <template v-if="!auth.isAuthenticated && isAuthRoute">
    <RouterView />
  </template>

  <!-- Si está logueado pero NO es admin: sólo se muestra el texto/pantalla limitada -->
  <template v-else-if="auth.isAuthenticated && !auth.isAdmin">
    <RouterView />
  </template>

  <!-- Si está logueado y es admin: ve la aplicación completa con menú -->
  <template v-else>
    <Menu @toggle-menu="handleToggleMenu" />
    <div class="main-content" :class="{ expanded: isMenuExpanded }">
      <RouterView />
    </div>
  </template>
</template>

<style scoped>
.main-content {
  margin-left: 90px;
  margin-top: 60px;
  transition: margin-left 0.3s ease;
}

.main-content.expanded {
  margin-left: 270px;
  transition: margin-left 0.3s ease;
}
</style>
