<script setup lang="ts">
import { ref, computed } from 'vue'
import StatisticsCard from '@/components/StatisticsCard.vue'
import ModalForm from '@/components/ModalForm.vue'
import { projectSchema } from '@/formSchemas/project.schema'
import Title from '../components/Title.vue'
import ModalEdit from '../components/ModalEdit.vue'
import ModalDelete from '../components/ModalDelete.vue'

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
    const res = await fetch(`http://localhost:3000/projects/${updatedProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProject)
    })
    const updated: Proyecto = await res.json()
    const idx = proyectos.value.findIndex(p => p.id === updated.id)
    if (idx !== -1) proyectos.value.splice(idx, 1, updated)

    showEditProjectModal.value = false
    editingProject.value = null
    editError.value = ''
  } catch (e: unknown) {
    editError.value = (e as Error).message || 'No se pudo actualizar el proyecto'
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
    await fetch(`http://localhost:3000/projects/${projectToDelete.value.id}`, { method: 'DELETE' })

    // Borramos del frontend
    proyectos.value = proyectos.value.filter(p => p.id !== projectToDelete.value!.id)

  } catch (e) {
    console.error('No se pudo borrar el proyecto', e)
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
      <input type="text" placeholder="buscar proyecto..." v-model="searchQuery"/>
      <button
      class="primary-button"
      @click="showAddProjectModal = true">
      Agregar Proyecto
      </button>
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
      <div class="action-buttons">
        <button @click="editProject(proyecto)">
          <span class="material-symbols-outlined edit">edit</span>
        </button>
        <button @click="deleteProject(proyecto.id)">
          <span class="material-symbols-outlined delete">delete</span>
        </button>
      </div>

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

.projects-header input {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc; /* un gris neutro */
  background-color: #fff;   /* fondo blanco */
  color: #111;              /* texto oscuro */
  font-size: 14px;
  cursor: text;             /* mejor que pointer en input */
  transition: background-color 0.2s, border-color 0.2s;
}

.projects-header input:focus {
  border-color: #2a4ea2;   /* azul cuando está activo */
  outline: none;
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

.primary-button {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #2a4ea2;
  color: #fff;
}

.primary-button:hover {
  background-color: #1b3570;
}

main {
  padding: 20px; /* menos margen lateral */
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden; /* esto quita el scroll horizontal */
}

.status.activo { background-color: #4CAF50; }
.status.pendiente { background-color: #FF9800; }
</style>
