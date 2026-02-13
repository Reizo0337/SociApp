<script setup lang="ts">
import { ref, computed } from 'vue'
import StatisticsCard from '@/components/StatisticsCard.vue'
import ModalForm from '@/components/ModalForm.vue'
import { projectSchema } from '@/formSchemas/project.schema'
import Title from '../components/Title.vue'
import ModalEdit from '../components/ModalEdit.vue'
import ModalDelete from '../components/ModalDelete.vue'
import ActionButtons from '../components/ActionButtons.vue'
import DataDisplay from '../components/DataDisplay.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import SearchInput from '../components/SearchInput.vue'
import { api } from '@/api'

// --- INTERFAZ DEL PROYECTO ---
interface Proyecto {
  id: number
  nombre: string
  responsable: string
  estado: string
  presupuesto: number
  subproyectos: string[]
  actividades: string[]
}

// variables
const totalProyectos = 8
const proyectosActivos = 5
const proyectosPendientes = 3
const showAddProjectModal = ref(false)

// Para los modales de editar y borrar
const editingProject = ref<Proyecto | null>(null)
const showEditProjectModal = ref(false)
const editError = ref('')

const projectToDelete = ref<Proyecto | null>(null)
const showDeleteProjectModal = ref(false)

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

const editProject = (proyecto: Proyecto) => {
  editingProject.value = { ...proyecto } // TS ya sabe que editingProject es Proyecto | null
  showEditProjectModal.value = true
}
const saveEdit = async (updatedProject: Proyecto) => {
  try {
    const res = await api.put(`/projects/${updatedProject.id}`, updatedProject)
    const updated: Proyecto = res.data
    const idx = proyectos.value.findIndex(p => p.id === updated.id)
    if (idx !== -1) proyectos.value.splice(idx, 1, updated)

    showEditProjectModal.value = false
    editingProject.value = null
    editError.value = ''
  } catch (e: unknown) {
    const errMsg = (e as any)?.response?.data?.message || (e as any)?.response?.data?.error || (e as Error).message || 'No se pudo actualizar el proyecto'
    editError.value = Array.isArray(errMsg) ? errMsg.join(', ') : errMsg
  }
}

const deleteProject = (id: number) => {
  // Buscamos el proyecto; si no existe, asignamos null
  projectToDelete.value = proyectos.value.find(p => p.id === id) || null
  showDeleteProjectModal.value = true
}

const confirmDelete = async () => {
  if (!projectToDelete.value) return

  try {
    // Borramos del backend
    await api.delete(`/projects/${projectToDelete.value.id}`)

    // Borramos del frontend
    proyectos.value = proyectos.value.filter(p => p.id !== projectToDelete.value!.id)

  } catch (e) {
    console.error('No se pudo borrar el proyecto', e)
    const errMsg = (e as any)?.response?.data?.message || (e as any)?.message || 'No se pudo eliminar el proyecto'
    alert(errMsg)
  } finally {
    // Cerramos modal y reseteamos valor
    showDeleteProjectModal.value = false
    projectToDelete.value = null
  }
}

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
      <SearchInput placeholder="buscar proyecto..." v-model="searchQuery"/>
      <PrimaryButton @click="showAddProjectModal = true">
        Agregar Proyecto
      </PrimaryButton>
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

      <!-- BOTONES -->
      <ActionButtons
        @edit="editProject(proyecto)"
        @delete="deleteProject(proyecto.id)"
      />

      <span class="status" :class="proyecto.estado.toLowerCase()">{{ proyecto.estado }}</span>
    </div>

    <DataDisplay
      :items="[
        { label: 'Responsable', value: proyecto.responsable },
        { label: 'Presupuesto', value: `${proyecto.presupuesto} €` },
        { label: 'Subproyectos', value: proyecto.subproyectos?.length || 0 },
        { label: 'Actividades', value: proyecto.actividades?.length || 0 }
      ]"
    />
  </div>
</div>
  </main>

  <!-- Modal de edición -->
<ModalEdit
  v-if="showEditProjectModal"
  :schema="projectSchema"
  :initial="editingProject ?? {}"
  :error="editError"
  @submit="saveEdit"
  @close="() => { showEditProjectModal = false; editingProject = null; editError = '' }"
/>

<!-- Modal de borrado -->
<ModalDelete
  v-if="showDeleteProjectModal"
  title="Eliminar proyecto"
  message="¿Estás seguro que quieres eliminar este proyecto?"
  :itemName="projectToDelete?.nombre"
  @confirm="confirmDelete"
  @close="() => { showDeleteProjectModal = false; projectToDelete = null }"
/>

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

/* SearchInput component ahora maneja estos estilos */

.projects-grid {
 display: grid;
 grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
 gap: 20px;
}

.project-card{
 background-color: var(--card-bg);
 border-radius: 12px;
 padding: 20px;
 box-shadow: 0 4px 12px var(--card-shadow);
 transition: transform 0.2s, box-shadow 0.2s, background-color 0.3s ease;
 border: 1px solid var(--border-color);
}

.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px var(--card-shadow-hover);
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
  color: var(--button-primary);
  transition: color 0.3s ease;
}

.status{
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

/* PrimaryButton component ahora maneja estos estilos */

main {
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}

main h2 {
  color: var(--text-primary);
  transition: color 0.3s ease;
}

/* DataDisplay component ahora maneja estos estilos */

.status.activo { background-color: #4CAF50; }
.status.pendiente { background-color: #FF9800; }
</style>
