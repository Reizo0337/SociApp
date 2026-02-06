<script setup lang="ts">
import { ref } from 'vue'
import StadisticsCard from '@/components/StatisticsCard.vue'

// Datos de ejemplo (mock)
</script>

<template>
  <section>
    <h1>Actividades</h1>
    <div class="actividades1">
      <StadisticsCard
        type="activity"
        title="Natacion pa abuelos"
        data="20 inscritos"
        icon="pool"
        color="#34b1eb"
      />
      <StadisticsCard
        type="activity"
        title="Curso de ingles"
        data="25 inscritos"
        icon="book"
        color="#4CAF50"
      />
      <StadisticsCard
        type="activity"
        title="Gimnasia para personas mayores"
        data="22 inscritos"
        localizacion="Sala 3"
        icon="exercise"
        color="#ebcd34"
      />
    </div>
    <div class="actividades2">
      <StadisticsCard
        type="activity"
        title="Yoga para personas mayores"
        data="18 inscritos"
        localizacion="Sala 1"
        icon="yoga"
        color="#9c27b0"
      />
      <StadisticsCard
        type="activity"
        title="Taller de manualidades"
        data="30 inscritos"
        localizacion="Sala 2"
        icon="craft"
        color="#ff5722"
      />
      <StadisticsCard
        type="activity"
        title="Taller de manualidades"
        data="30 inscritos"
        localizacion="Sala 2"
        icon="craft"
        color="#ff5722"
      />
    </div>
  </section>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.actividades1 {
  margin: 5px;
  width: 100%;
}
.actividades2 {
  margin: 5px;
  padding-left: 300px;
  margin-top: -555px;
  width: 100%;
}
</style>
