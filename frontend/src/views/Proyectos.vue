<script setup lang="ts">
import { ref, computed } from 'vue'
import StatisticsCard from '@/components/StatisticsCard.vue'
import ModalForm from '@/components/ModalForm.vue'
import { projectSchema } from '@/formSchemas/project.schema'
import Title from '../components/Title.vue'

// variables
const totalProyectos = 8
const proyectosActivos = 5
const proyectosPendientes = 3
const showAddProjectModal = ref(false)


//lista de proyectos
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

//busqueda
const searchQuery = ref('')
const filteredProyectos = computed(() => {
  if (!searchQuery.value) return proyectos.value
  return proyectos.value.filter(p =>
    Object.values(p).some(val =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
})
</script>
<template>
  <main>
    <Title title="Proyectos" icon="Folder" />

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

    <!-- Buscador y boton -->

    <div class ="projects-header">
      <input type="text" placeholder="buscar proyecto..." v-model="searchQuery"/>
      <button @click="showAddProjectModal = true">Agregar Proyecto</button>
    <ModalForm
       v-if="showAddProjectModal"
      :schema="projectSchema"
      :onClose="() => (showAddProjectModal = false)"
    />
    </div>

        <!-- Grid de proyectos -->
    <div class="projects-grid">
      <div v-for="proyecto in filteredProyectos" :key="proyecto.id" class="project-card">
        <div class="card-header">
          <h3>{{ proyecto.nombre }}</h3>
          <span class="status" :class="proyecto.estado.toLowerCase()">{{ proyecto.estado }}</span>
        </div>
        <div class="card-body">
          <p><strong>Responsable:</strong> {{ proyecto.responsable }}</p>
          <p><strong>Presupuesto:</strong> {{ proyecto.presupuesto }} €</p>
          <p><strong>Subproyectos:</strong> {{ proyecto.subproyectos?.length || 0 }}</p>
          <p><strong>Actividades:</strong> {{ proyecto.actividades?.length || 0 }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.statistics-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.projects-header input{
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #2a4ea2;
  background-color: #2a4ea2;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.projects-header button:hover {
  background-color: #1b3570;
}

.projects-grid {
 display: grid;
 grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
 gap: 20px;
}

.project-card{
 background-color: #fff;
 border-radius: 12px;
 padding: 20px;
 box-shadow: 0 4px 12px rgba(0,0,0,0.08);
 transition: transform 0.2s, box-shadow 0.2s;
}

:global(.dark) .project-card {
  background-color: #1e1e1e;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.card-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h3{
  margin: 0;
  font-size: 18px;
  color: #2a4ea2;
}

:global(.dark) .card-header h3 {
  color: #63c2de;
}

.status{
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.status.activo { background-color: #4CAF50; }
.status.pendiente { background-color: #FF9800; }
</style>
