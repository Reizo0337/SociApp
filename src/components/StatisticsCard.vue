<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{
  type: 'activity' | 'project' | 'user' | 'task' | 'stats'
  title?: string
  data?: string | number
  icon?: string
  href?: string
  color?: string
  localizacion?: string
}>()

const typeClass = computed(() => (props.type ? `type-${props.type}` : ''))
</script>

<template>
  <div class="statistics-card" :class="typeClass ? `type-${type}` : ''">
    <div class="title">
      <span
        class="material-symbols-outlined"
        :style="{ color: color }"
        v-if="icon"
        >{{ icon }}</span
      >
      <h3>{{ title }}</h3>
    </div>
    <div class="unify">
      <div class="data">
        <p>{{ data }}</p>
      </div>
      <div class="localizacion" v-if="localizacion">
        <p>{{ localizacion }}</p>
      </div>
      <div class="link">
        <RouterLink :to="href" v-if="href">Ver detalles</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statistics-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 16px;
  margin-bottom: 16px;
  border: 1px solid #00000056;
}

.type-activity {
  background-color: #eaebed;
  width: 200px;
}

.type-activity .title {
  color: #000;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unify {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 100%;
  /* go bottom */
  margin-top: auto;
  margin-bottom: auto;
}

.separator {
  width: 1px;
  height: 100%;
  gap: 8px;
}

.data {
  color: #2196f3;
}

.link {
  font-size: 14px;
  color: #2196f3;
  text-decoration: none;
}
</style>
