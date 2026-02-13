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
    if (stats?.value?.[4]) stats.value[4].data = data.trabajadores ?? 0;
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

.chart-container {
  margin-top: 50px;
  margin-left: 50px;
  margin-right: 50px;
  border-top: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.statistics-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  margin-left: 50px;
  margin-right: 50px;
}

.statistics-container > *:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px var(--card-shadow-hover);
  transition: all 0.3s ease;
}
</style>
