<script setup lang="ts">
import StatisticsCard from '@/components/StatisticsCard.vue'
import { ref, onMounted, computed } from 'vue'
import Title from '@/components/Title.vue'
import Chart from '@/components/Chart.vue'

const stats = ref([
  { title: 'Socios', data: 0, icon: 'people', href: '/usuarios?search=Socio', background: '#20a8d8' },
  { title: 'No Socios', data: 0, icon: 'people', href: '/usuarios?search=noSocio', background: '#63c2de' },
  { title: 'Actividades', data: 0, icon: 'event', href: '/actividades', background: '#fec106' },
  { title: 'Proyectos', data: 0, icon: 'assignment', href:'/proyectos', background: '#f86c6b' },
  { title: 'Trabajadores', data: 0, icon:'person', href:'/usuarios?search=trabajador', background: '#20a8d8' }
])


onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/stats')
    if (response.ok) {
      const data = await response.json()
      // añadir a data un mini texto en un futuro
      if (stats?.value?.[0]) stats.value[0].data = data.socios ?? 0;
      if (stats?.value?.[1]) stats.value[1].data = data.noSocios ?? 0;
      if (stats?.value?.[2]) stats.value[2].data = data.actividades ?? 0;
      if (stats?.value?.[3]) stats.value[3].data = data.proyectos ?? 0;
      if (stats?.value?.[4]) stats.value[4].data = data.trabajadores ?? 0;
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }
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


const chartOptions = {
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
    },
  },
}
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
}

.chart-container {
  margin-top: 50px;
  margin-left: 50px;
  margin-right: 50px;
  border-top: 1px solid #000;
}

.statistics-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  margin-left: 50px;
  margin-right: 50px;
}

.statistics-container > *:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0,0,0,.15);
  transition: all 0.3s ease;
}

.statistics-container > *:hover {
  transform: translateY(-3px);
}

:global(.dark) .statistics-container > *:hover {
  box-shadow: 0 6px 14px rgba(0,0,0,.5);
}
</style>
