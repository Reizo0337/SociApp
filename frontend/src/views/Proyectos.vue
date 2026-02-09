<script setup lang="ts">
import { ref, computed } from 'vue'
import StatisticsCard from '@/components/StatisticsCard.vue'
import ModalForm from '@/components/ModalForm.vue'

// variables
const totalProyectos = 8
const proyectosActivos = 5
const proyectosPendientes = 3


//lista de proyectos uwu
const proyectos = ref([
  {
    id: 1,
    nombre: "Cultura",
    responsable: "Ana Pérez",
    estado: "Activo",
    presupuesto: 5000,
    subproyectos: ["Promoción de salud"],
    actividades: ["Yoga", "Dibujo"]
  },
  {
    id: 2,
    nombre: "Concursos",
    responsable: "Juan Ruiz",
    estado: "Pendiente",
    presupuesto: 2000,
    subproyectos: [],
    actividades: []
  },
  {
    id: 3,
    nombre: "Prevención de adicciones",
    responsable: "María Gómez",
    estado: "Activo",
    presupuesto: 4000,
    subproyectos: ["Atención a jóvenes"],
    actividades: ["Charla informativa"]
  }
])

//eu busquedinha
const searchQuery = ref('')
const filteredProyectos = computed(() => {
  if (!searchQuery.value) return proyectos.value
  return proyectos.value.filter(p =>
    Object.values(p).some(val =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
})

const showAddProjectModal = ref(false)

</script>
<template>
  <main>
    <h1>Proyectos</h1>
    <p>Gestiona todos los proyectos de la asociación desde esta vista.</p>

    <h2>Estadisticas del proyecto</h2>
    <div class="statistics-container">
      <StatisticsCard
        type="project"
        title="Total de Proyectos"
        :data="totalProyectos"
        icon="folder"
        color="#4CAF50"
        href="/proyectos"
      />

      <StatisticsCard
        type="project"
        title="Proyectos Activos"
        :data="proyectosActivos"
        icon="play_circle"
        color="#2196F3"
        href="/proyectos/activos"
      />

      <StatisticsCard
        type="project"
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
