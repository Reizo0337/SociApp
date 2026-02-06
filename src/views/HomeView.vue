<script setup lang="ts">
import StatisticsCard from '@/components/StatisticsCard.vue'
</script>

<template>
  <main>
    <h1>SociApp</h1>
    <p>Bienvenido a SociApp, tu aplicación de gestión social.</p>

    <h2>Estadisticas:</h2>
    <div class="statistics-container">
      <StatisticsCard
        type="stats"
        title="Usuarios activos"
        data="120"
        icon="people"
        color="#4CAF50"
        href="/usuarios"
      />

      <StatisticsCard
        type="stats"
        title="Eventos próximos"
        data="5"
        icon="event"
        color="#2196F3"
        href="/eventos"
      />

      <StatisticsCard
        type="stats"
        title="Actividades en curso"
        data="3"
        icon="sports_kabaddi"
        color="#FF9800"
        href="/actividades"
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
