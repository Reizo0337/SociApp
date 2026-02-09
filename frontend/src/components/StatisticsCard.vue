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
  background?: string
}>()

const typeClass = computed(() => (props.type ? `type-${props.type}` : ''))
</script>

<template>
  <div class="statistics-card" :class=typeClass :style="{ backgroundColor: background }">
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
      <RouterLink v-if="href" class="link" :to="href">
        Ver detalles
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* Estadisticas card */
.type-stats{
  width: 300px;
  min-height: 100px;
  height: 150px;
  position: relative;
  color: #fff;
  border: none;
  gap: 8px;
}

.type-stats.statistics-card {
  gap: 6px;
}

.type-stats .link {
  position: absolute;
  /* it must be down */
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  text-decoration: none;
  color: #fff;
}

.type-stats .title {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding-bottom: 8px;
  color: #fff;
  font-weight: bold;
  line-height: 1;
}

.type-stats .title span {
  font-size: 24px;
}

.type-stats .data {
  position: absolute;
  font-size: 38px;
  color: #fff;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.type-stats .unify {
  display: flex;
  flex-direction: column;
  align-items: center;
}


/* Actividades card */
.type-activity {
  background-color: #eaebed;
  width: 200px;
}

.type-activity .title {
  color: #000;
}



/* Cards comunes */
.statistics-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 16px;
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
  width: 100%;
  /* go bottom */
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
