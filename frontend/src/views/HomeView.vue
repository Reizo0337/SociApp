<script setup lang="ts">
import StatisticsCard from '@/components/StatisticsCard.vue'
import { ref, onMounted, computed, watch } from 'vue'
import Title from '@/components/Title.vue'
import Chart from '@/components/Chart.vue'
import { api } from '@/api'

const stats = ref([
  { title: 'Socios', data: 0, icon: 'people', href: '/usuarios?search=Socio', background: '#20a8d8' },
  { title: 'No Socios', data: 0, icon: 'people', href: '/usuarios?search=noSocio', background: '#63c2de' },
  { title: 'Actividades', data: 0, icon: 'event', href: '/actividades', background: '#fec106' },
  { title: 'Proyectos', data: 0, icon: 'assignment', href:'/proyectos', background: '#f86c6b' },
  { title: 'Activos', data: 0, icon: 'play_circle', href:'/proyectos?search=Activo', background: '#2196F3' },
  { title: 'Pendientes', data: 0, icon: 'hourglass_empty', href:'/proyectos?search=Pendiente', background: '#FF9800' },
  { title: 'Trabajadores', data: 0, icon:'person', href:'/usuarios?search=trabajador', background: '#20a8d8' }
])


const isDark = ref(document.documentElement.classList.contains('dark'))

// Observar cambios en el modo oscuro para actualizar el chart
onMounted(async () => {
  try {
    const response = await api.get('/stats')
    const data = response.data
    // añadir a data un mini texto en un futuro
    if (stats?.value?.[0]) stats.value[0].data = data.socios ?? 0;
    if (stats?.value?.[1]) stats.value[1].data = data.noSocios ?? 0;
    if (stats?.value?.[2]) stats.value[2].data = data.actividades ?? 0;
    if (stats?.value?.[3]) stats.value[3].data = data.proyectos ?? 0;
    if (stats?.value?.[4]) stats.value[4].data = data.proyectosActivos ?? 0;
    if (stats?.value?.[5]) stats.value[5].data = data.proyectosPendientes ?? 0;
    if (stats?.value?.[6]) stats.value[6].data = data.trabajadores ?? 0;
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }
  
  // Observar cambios en la clase dark del documento
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

const chartData = computed(() => ({
  labels: stats.value.map(stat => stat.title),
  datasets: [
    {
      label: 'Estadísticas',
      data: stats.value.map(stat => stat.data),
      borderColor: '#20a8d8',
      backgroundColor: 'rgba(32,168,216,0.2)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#20a8d8',
      pointBorderColor: '#20a8d8',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }
  ]
}))


const chartOptions = computed(() => {
  return {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark.value ? '#e0e0e0' : '#666',
        },
        grid: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: isDark.value ? '#e0e0e0' : '#666',
        },
        grid: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
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
    <div class="chart-container">
      <Chart :chartData="chartData" :chartOptions="chartOptions" />
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px 40px;
  min-height: 100vh;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}

@media (max-width: 768px) {
  main {
    padding: 20px 15px;
  }
}

.statistics-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 30px;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .statistics-container {
    padding: 0 10px;
    gap: 15px;
  }
}

.statistics-container > * {
  width: 100% !important;
  margin-bottom: 0;
  height: 160px;
}

.statistics-container > *:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px var(--card-shadow-hover);
  transition: all 0.3s ease;
}

.chart-container {
  margin: 50px 20px 0 20px;
  padding-top: 30px;
  border-top: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

@media (max-width: 768px) {
  .chart-container {
    margin: 30px 10px 0 10px;
  }
}
</style>
