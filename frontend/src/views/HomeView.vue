<script setup lang="ts">
import StatisticsCard from '@/components/StatisticsCard.vue'
import { ref, onMounted } from 'vue'
import Title from '@/components/Title.vue'

const stats = ref([
  { title: 'Socios', data: 0, icon: 'people', href: '/usuarios', background: '#20a8d8' },
  { title: 'No Socios', data: 0, icon: 'people', href: '/usuarios', background: '#63c2de' },
  { title: 'Actividades', data: 0, icon: 'event', href: '/eventos', background: '#fec106' },
  { title: 'Proyectos', data: 0, icon: 'assignment', background: '#f86c6b' }
  // Agrega más estadísticas según sea necesario
])

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/stats')
    if (response.ok) {
      const data = await response.json()
      if (stats?.value?.[0]) stats.value[0].data = data.socios ?? 0;
      if (stats?.value?.[1]) stats.value[1].data = data.noSocios ?? 0;
      if (stats?.value?.[2]) stats.value[2].data = data.actividades ?? 0;
      if (stats?.value?.[3]) stats.value[3].data = data.proyectos ?? 0;
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }
})

</script>

<template>
  <main>
    <Title title="Estadisticas" icon="bar_chart" />
    <div class="statistics-container">
      <StatisticsCard
        v-for="stat in stats"
        :key="stat.title"
        type="stats"
        v-bind="stat"
      />
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px 40px;
  min-height: 100vh;
}



.statistics-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
  margin-left: 50px;
}

.statistics-container > *:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0,0,0,.15);
  transition: all 0.3s ease;
}

.statistics-container > *:hover {
  transform: translateY(-3px);
}
</style>
