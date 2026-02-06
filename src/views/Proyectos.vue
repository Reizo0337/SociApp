<script setup lang="ts">
import StatisticsCard from '@/components/StatisticsCard.vue'

// variables
const totalProyectos = 8
const proyectosActivos = 5
const proyectosPendientes = 3
</script>

<template>
  <main>
    <h1>Proyectos</h1>
    <p>Gestiona todos los proyectos de la asociación desde esta vista.</p>

    <h2>Estadisticas del proyecto</h2>

    <div class="statistics-container">
      <StatisticsCard
        type="stats"
        title="Total de Proyectos"
        :data="totalProyectos"
        icon="folder"
        color="#4CAF50"
        href="/proyectos"
      />

      <StatisticsCard
        type="stats"
        title="Proyectos Activos"
        :data="proyectosActivos"
        icon="play_circle"
        color="#2196F3"
        href="/proyectos/activos"
      />

      <StatisticsCard
        type="stats"
        title="Proyectos Pendientes"
        :data="proyectosPendientes"
        icon="hourglass_empty"
        color="#FF9800"
        href="/proyectos/pendientes"
      />
    </div>
  </main>
</template>

<style scoped>
.statistics-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
