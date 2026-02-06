<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Menu from './components/Menu.vue'

const isMenuExpanded = ref(false)

const handleToggleMenu = (expanded: boolean) => {
  isMenuExpanded.value = expanded
}
</script>

<template>
  <Menu @toggle-menu="handleToggleMenu" />
  <div class="main-content" :class="{ 'expanded': isMenuExpanded }">
    <RouterView />
  </div>
</template>

<style scoped>
.main-content {
  margin-left: 100px;
  padding: 20px;
  transition: margin-left 0.3s ease;
}

.main-content.expanded {
  margin-left: 300px;
}
</style>
