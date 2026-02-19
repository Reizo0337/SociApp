<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
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
import ExpandableListItem from '../components/ExpandableListItem.vue'
import PdfPreview from '@/components/PdfPreview.vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projects'

const projectStore = useProjectStore()
const route = useRoute()

// --- INTERFAZ DEL PROYECTO ---
interface Proyecto {
  idProyecto: number
  nombre: string
  responsable?: {
    IdUsuario: number
    nombre: string
    apellidos?: string
  }
  responsableId?: number
  estado: string
  presupuesto: number
  departamento?: string
  fuenteFinanciacion?: string
  startDate: string
  endDate?: string
  descripcion?: string
  notas?: string
  subproyectos?: string[]
  actividades?: string[]
  activityIds?: number[]
  pdfPath?: string[]
  detallesActividades?: { id: number; nombre: string }[]
}

// Variables reactivas
const projects = computed(() => projectStore.projects)
const selectedProject = ref<Proyecto | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const showAddProjectModal = ref(false)
const showEditProjectModal = ref(false)
const showDeleteProjectModal = ref(false)
const editingProject = ref<Proyecto | null>(null)
const projectToDelete = ref<Proyecto | null>(null)
const editError = ref('')
const currentPdfIndex = ref(0)

// Reiniciar el índice del PDF cuando se cambia de proyecto
watch(selectedProject, () => {
  currentPdfIndex.value = 0
})

// Computed properties
const totalProyectos = computed(() => projects.value.length)
const proyectosActivos = computed(() => (projects.value as any[]).filter((p: any) => p.estado === 'Activo').length)
const proyectosPendientes = computed(() => (projects.value as any[]).filter((p: any) => p.estado === 'Pendiente').length)

const filteredProyectos = computed(() => {
  let base = projects.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    base = projects.value.filter((p: any) =>
      Object.values(p).some((val: any) =>
        String(val).toLowerCase().includes(query)
      )
    )
  }

  return [...base].sort((a: any, b: any) => {
    const aFinalizado = a.estado?.toLowerCase() === 'finalizado'
    const bFinalizado = b.estado?.toLowerCase() === 'finalizado'

    // 1. Los finalizados van al final
    if (aFinalizado !== bFinalizado) {
      return aFinalizado ? 1 : -1
    }

    // 2. Proximidad de finalización (endDate)
    // Si no tienen fecha de fin, se consideran con menor prioridad de visualización
    if (a.endDate && b.endDate) {
      const dateA = new Date(a.endDate).getTime()
      const dateB = new Date(b.endDate).getTime()
      
      // Si están terminados, los más recientes arriba dentro del grupo finalizados
      if (aFinalizado) return dateB - dateA
      
      // Si están activos/pendientes, los que terminan antes arriba
      return dateA - dateB
    }

    if (a.endDate) return -1
    if (b.endDate) return 1

    return 0
  })
})

const paginatedProyectos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return (filteredProyectos.value as any[]).slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredProyectos.value.length / itemsPerPage))

const showingRange = computed(() => {
  if (filteredProyectos.value.length === 0) return '0 - 0'
  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(start + itemsPerPage - 1, filteredProyectos.value.length)
  return `${start} - ${end}`
})

// Metodos
const fetchProjects = async () => {
  await projectStore.fetchProjects()
}

const buildFormData = (data: any) => {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    const value = data[key]
    if (value === undefined || value === null || value === '') return

    if (key === 'pdf') {
      if (Array.isArray(value)) {
        value.forEach(file => {
          if (file instanceof File) formData.append('pdf', file)
        })
      } else if (value instanceof File) {
        formData.append('pdf', value)
      }
    } else if (Array.isArray(value)) {
      // Para enviar arrays en FormData, añadimos cada elemento con la misma clave
      value.forEach(v => {
        if (v !== undefined && v !== null && v !== '') {
          formData.append(key, v)
        }
      })
    } else {
      formData.append(key, value)
    }
  })
  return formData
}

const hasFiles = (data: any) => {
  if (data.pdf instanceof File) return true
  if (Array.isArray(data.pdf)) return data.pdf.some((f: any) => f instanceof File)
  return false
}

const cleanProjectData = (data: any) => {
  const allowed = [
    'nombre', 'descripcion', 'estado', 'responsableId', 
    'presupuesto', 'fuenteFinanciacion', 'startDate', 
    'endDate', 'notas', 'subproyectos', 'actividades', 
    'activityIds', 'pdfPath', 'idProyecto', 'pdf'
  ];
  const cleaned: any = {};
  Object.keys(data).forEach(key => {
    if (allowed.includes(key) && data[key] !== undefined && data[key] !== null) {
      cleaned[key] = data[key];
    }
  });
  return cleaned;
};

const createProject = async (newProject: any) => {
  try {
    const cleaned = cleanProjectData(newProject)
    let data;
    if (hasFiles(cleaned)) {
      data = buildFormData(cleaned)
    } else {
      data = { ...cleaned }
      delete data.pdf
    }
    await projectStore.addProject(data)
    showAddProjectModal.value = false
  } catch (error: any) {
    console.error('Error creating project:', error)
    alert(error?.response?.data?.message || 'Error al crear proyecto')
  }
}

const editProject = (proyecto: Proyecto) => {
  editingProject.value = { 
    ...proyecto,
    activityIds: proyecto.actividades ? proyecto.actividades.map(id => Number(id)) : []
  }
  showEditProjectModal.value = true
}

const saveEdit = async (updatedProject: any) => {
  try {
    const cleaned = cleanProjectData(updatedProject)
    const idToUpdate = cleaned.idProyecto || editingProject.value?.idProyecto
    if (!idToUpdate) throw new Error('ID de proyecto no encontrado')
    
    let data;
    if (hasFiles(cleaned)) {
      data = buildFormData(cleaned)
    } else {
      data = { ...cleaned }
      delete data.pdf
    }
    await projectStore.updateProject(idToUpdate, data)

    showEditProjectModal.value = false
    editingProject.value = null
    editError.value = ''
  } catch (e: unknown) {
    const errMsg = (e as any)?.response?.data?.message || (e as any)?.response?.data?.error || (e as Error).message || 'No se pudo actualizar el proyecto'
    editError.value = Array.isArray(errMsg) ? errMsg.join(', ') : errMsg
  }
}

const deleteProjectBtn = (id: number) => {
  projectToDelete.value = projects.value.find(p => p.idProyecto === id) || null
  showDeleteProjectModal.value = true
}

const confirmDelete = async () => {
  if (!projectToDelete.value) return
  const idToDelete = projectToDelete.value.idProyecto
  try {
    await projectStore.removeProject(idToDelete)
  } catch (e) {
    console.error('No se pudo borrar el proyecto', e)
    const errMsg = (e as any)?.response?.data?.message || (e as any)?.message || 'No se pudo eliminar el proyecto'
    alert(errMsg)
  } finally {
    showDeleteProjectModal.value = false
    projectToDelete.value = null
  }
}

const openProjectDetails = (project: Proyecto) => {
  selectedProject.value = project
}

const closeProjectDetails = () => {
  selectedProject.value = null
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Watchers
watch(searchQuery, () => {
  currentPage.value = 1
})

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search as string
  }
  fetchProjects()
})
</script>

<template>
  <main>
    <Title title="Proyectos" icon="Folder" />

    <div v-if="!selectedProject">
      <div class="projects-header">
        <div class="options">
          <div class="pagination-controls" v-if="filteredProyectos.length > 0">
            <span>{{ showingRange }} de {{ filteredProyectos.length }}</span>
            <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <PrimaryButton @click="showAddProjectModal = true">
            Agregar Proyecto
          </PrimaryButton>
        </div>
        <SearchInput placeholder="Buscar proyecto..." v-model="searchQuery"/>
      </div>

      <div class="projects-list">
        <ExpandableListItem
          v-for="proyecto in paginatedProyectos"
          :key="proyecto.idProyecto"
          :expanded="false"
          :show-arrow="false"
          @toggle="openProjectDetails(proyecto)"
        >
          <template #summary-left>
            <div class="project-info">
              <span class="project-name">{{ proyecto.nombre }}</span>
              <span class="project-responsable">{{ proyecto.responsable?.nombre || 'Sin asignar' }}</span>
            </div>
          </template>
          <template #summary-right>
            <div class="project-actions">
              <span class="status-badge" :class="proyecto.estado.toLowerCase()">{{ proyecto.estado }}</span>
              <ActionButtons
                showEdit
                showDelete
                @edit="editProject(proyecto)"
                @delete="deleteProjectBtn(proyecto.idProyecto)"
              />
              <span class="material-symbols-outlined arrow">chevron_right</span>
            </div>
          </template>
        </ExpandableListItem>
      </div>

      <ModalForm
        v-if="showAddProjectModal"
        :schema="projectSchema"
        @close="() => (showAddProjectModal = false)"
        @submit="createProject"
      />
    </div>

    <!-- PÁGINA VIRTUAL: DETALLES -->
    <div v-else class="project-detail-view">
      <div class="detail-header">
        <button class="back-btn" @click="closeProjectDetails">
          <span class="material-symbols-outlined">arrow_back</span>
          Volver a la lista
        </button>
        <div class="header-actions">
           <ActionButtons
              showEdit
              showDelete
              @edit="editProject(selectedProject!); closeProjectDetails()"
              @delete="deleteProjectBtn(selectedProject!.idProyecto); closeProjectDetails()"
            />
        </div>
      </div>

      <div class="detail-content card">
        <div class="detail-title-section">
          <div class="title-with-icon">
            <span class="material-symbols-outlined project-hero-icon">folder_open</span>
            <div class="title-text-group">
              <h1>{{ selectedProject.nombre }}</h1>
              <p class="project-subtitle">{{ selectedProject.departamento || 'Sin departamento' }}</p>
            </div>
          </div>
          <span class="status-badge large" :class="selectedProject.estado.toLowerCase()">{{ selectedProject.estado }}</span>
        </div>

        <div class="detail-metrics">
          <div class="metric-card budget">
            <span class="material-symbols-outlined">payments</span>
            <div class="metric-info">
              <span class="metric-label">Presupuesto Total</span>
              <span class="metric-value">{{ selectedProject.presupuesto }} €</span>
            </div>
          </div>
          <div class="metric-card timeline">
            <span class="material-symbols-outlined">calendar_today</span>
            <div class="metric-info">
              <span class="metric-label">Fecha de Inicio</span>
              <span class="metric-value">{{ selectedProject.startDate }}</span>
            </div>
          </div>
        </div>

        <div class="detail-grid">
          <div class="info-section box-item">
            <h3>
              <span class="material-symbols-outlined">person</span>
              Responsable
            </h3>
            <div class="detail-item">
              <p class="detail-value primary">{{ selectedProject.responsable?.nombre || 'Sin asignar' }}</p>
              <p class="detail-sub">{{ selectedProject.responsable?.apellidos || '' }}</p>
            </div>
          </div>

          <div class="info-section box-item">
            <h3>
              <span class="material-symbols-outlined">source</span>
              Financiación
            </h3>
            <DataDisplay
              :items="[
                { label: 'Fuente', value: selectedProject.fuenteFinanciacion || 'No especificada' }
              ]"
            />
          </div>

          <div class="info-section full-width box-item highlight-block">
            <h3>
              <span class="material-symbols-outlined">description</span>
              Descripción del Proyecto
            </h3>
            <p class="description-text">{{ selectedProject.descripcion || 'Sin descripción' }}</p>
          </div>

          <div class="info-section box-item" v-if="selectedProject.pdfPath && selectedProject.pdfPath.length > 0">
            <h3>
              <span class="material-symbols-outlined">attachment</span>
              Documentación ({{ selectedProject.pdfPath.length }})
            </h3>
            
            <div v-if="selectedProject.pdfPath.length > 1" class="pdf-selector">
              <label>Seleccionar archivo:</label>
              <select v-model="currentPdfIndex">
                <option v-for="(path, index) in selectedProject.pdfPath" :key="index" :value="index">
                  Archivo {{ index + 1 }} - {{ path.split('/').pop() }}
                </option>
              </select>
            </div>

            <div class="pdf-actions" v-if="selectedProject?.pdfPath && selectedProject.pdfPath[currentPdfIndex]">
              <a 
                :href="`http://localhost:3000${selectedProject.pdfPath[currentPdfIndex]?.trim()}`" 
                target="_blank" 
                class="pdf-link"
              >
                <span class="material-symbols-outlined">open_in_new</span>
                Abrir en pestaña nueva
              </a>
            </div>

            <div class="pdf-preview-wrapper" v-if="selectedProject?.pdfPath && selectedProject.pdfPath[currentPdfIndex]">
              <PdfPreview :pdf-url="`http://localhost:3000${selectedProject.pdfPath[currentPdfIndex]?.trim()}`" />
            </div>
          </div>

          <div class="info-section box-item">
             <h3>
               <span class="material-symbols-outlined">event_note</span>
               Seguimiento y Notas
             </h3>
             <p class="notes-text">{{ selectedProject.notas || 'Sin notas' }}</p>
          </div>

          <div class="info-section box-item">
            <h3>
              <span class="material-symbols-outlined">analytics</span>
              Capacidad y Vínculos
            </h3>
            <div class="stat-mini-grid">
              <div class="mini-stat">
                <span class="stat-num">{{ selectedProject.subproyectos?.length || 0 }}</span>
                <span class="stat-label">Subproyectos</span>
              </div>
              <div class="mini-stat">
                <span class="stat-num">{{ selectedProject.actividades?.length || 0 }}</span>
                <span class="stat-label">Actividades</span>
              </div>
            </div>
            
            <div v-if="selectedProject.detallesActividades?.length" class="activities-linked-list">
              <p class="linked-title">Actividades asignadas:</p>
              <ul>
                <li v-for="act in selectedProject.detallesActividades" :key="act.id">
                  <RouterLink :to="`/actividades?search=${act.nombre}`" class="activity-link">
                    <span class="material-symbols-outlined">event_available</span>
                    {{ act.nombre }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalEdit
      v-if="showEditProjectModal"
      :schema="projectSchema"
      :initial="editingProject ?? {}"
      :error="editError"
      @submit="saveEdit"
      @close="() => { showEditProjectModal = false; editingProject = null; editError = '' }"
    />

    <ModalDelete
      v-if="showDeleteProjectModal"
      title="Eliminar proyecto"
      message="¿Estás seguro que quieres eliminar este proyecto?"
      :itemName="projectToDelete?.nombre"
      @confirm="confirmDelete"
      @close="() => { showDeleteProjectModal = false; projectToDelete = null }"
    />
  </main>
</template>

<style scoped>
.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
}

@media (max-width: 768px) {
  .projects-header {
    flex-direction: column;
    align-items: stretch;
  }
}

.options {
  display: flex;
  align-items: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .options {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: var(--text-secondary);
  background: var(--card-bg);
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .main-content.collapsed,
  .main-content.expanded {
    margin-left: 0;
  }
}

.main-content {
  overflow-x: hidden;
  max-width: 100vw;
}

@media (max-width: 480px) {
  .pagination-controls {
    justify-content: space-between;
    width: 100%;
  }
}

.page-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--text-primary);
  transition: all 0.2s;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn:hover:not(:disabled) {
  background: var(--button-secondary-hover);
  border-color: var(--button-primary);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-section .data-display p {
  overflow-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
}

.project-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

@media (max-width: 480px) {
  .project-name {
    max-width: 100%;
  }
}

.project-responsable {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.project-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.activo { background-color: rgba(76, 175, 80, 0.2); color: #4CAF50; }
.status-badge.pendiente { background-color: rgba(255, 152, 0, 0.2); color: #FF9800; }
.status-badge.finalizado { background-color: rgba(158, 158, 158, 0.2); color: #9E9E9E; }

.status-badge.large {
  font-size: 0.9rem;
  padding: 6px 14px;
}

.arrow {
  color: var(--text-secondary);
  opacity: 0.5;
}

/* Detail View Styles */
.project-detail-view {
  animation: fadeIn 0.3s ease-out;
  max-width: 100%;
  box-sizing: border-box;
}

.project-detail-view * {
  box-sizing: border-box;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--button-primary);
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
  transition: transform 0.2s;
  font-size: 18px;
}

.back-btn:hover {
  transform: translateX(-5px);
}

.detail-content.card {
  background: var(--card-bg);
  padding: 40px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px var(--card-shadow);
}

.detail-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 20px;
}

.detail-title-section h1 {
  margin: 0;
  font-size: 2.5rem;
  color: var(--text-primary);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}



.title-with-icon {
  display: flex;
  align-items: center;
  gap: 20px;
}

.project-hero-icon {
  font-size: 4rem;
  color: var(--button-primary);
  opacity: 0.8;
}

.title-text-group h1 {
  margin: 0;
  font-size: 2.2rem;
  color: var(--text-primary);
}

.project-subtitle {
  margin: 4px 0 0 0;
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
}

.detail-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

:global(.dark) .metric-card {
  background: #0a0a0b;
}

.metric-card:hover {
  border-color: var(--button-primary);
  transform: translateY(-2px);
}

.pdf-link:hover {
  background: var(--button-primary);
  color: white;
  transform: translateY(-2px);
}

.pdf-preview-wrapper {
  margin-top: 15px;
  width: 100%;
}

.metric-card span.material-symbols-outlined {
  font-size: 2rem;
  color: var(--button-primary);
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.info-section.box-item {
  background: var(--bg-secondary);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--card-shadow);
}

:global(.dark) .info-section.box-item {
  background: #0a0a0b;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.info-section.box-item:hover {
  border-color: var(--button-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--card-shadow-hover);
}

.highlight-block {
  border: 1px dashed var(--button-primary) !important;
  background: var(--bg-tertiary) !important;
}

:global(.dark) .highlight-block {
  background: #000000 !important;
}

.info-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 15px 0;
  color: var(--button-primary);
  font-size: 1.2rem;
  font-weight: 600;
  border-left: 4px solid var(--button-primary);
  padding-left: 12px;
}

.detail-item {
  padding-left: 5px;
}

.detail-value.primary {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.detail-sub {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 2px 0 0 0;
}

.stat-mini-grid {
  display: flex;
  gap: 15px;
}

.mini-stat {
  background: var(--card-bg);
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  text-align: center;
  min-width: 80px;
  flex: 1;
}

.stat-num {
  display: block;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--button-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.full-width {
  grid-column: span 2;
}

/* PDF Selector & Actions */
.pdf-selector {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pdf-selector label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pdf-selector select {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
  cursor: pointer;
}

.pdf-selector select:focus {
  border-color: var(--button-primary);
  box-shadow: 0 0 0 3px rgba(var(--button-primary-rgb, 37, 99, 235), 0.2);
}

.pdf-actions {
  margin-bottom: 15px;
  display: flex;
  gap: 12px;
}

.pdf-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.pdf-link:hover {
  background: var(--button-primary);
  color: white;
  border-color: var(--button-primary);
  transform: translateY(-2px);
}

.pdf-link span {
  font-size: 1.2rem;
}

.description-text, .notes-text {
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

main {
  padding: 40px;
  min-height: 100vh;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}

@media (max-width: 768px) {
  main {
    padding: 20px 15px;
  }
}

main h2 {
  color: var(--text-primary);
  margin-bottom: 20px;
  font-weight: 600;
}
@media (max-width: 768px) {
  .project-detail-view {
    padding: 0;
    margin: 0;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  .detail-header {
    flex-direction: column;
    align-items: stretch; 
    gap: 15px;
    margin-bottom: 20px;
    width: 100%;
    padding: 0;
  }

  .header-actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .detail-grid, .detail-metrics {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0;
    padding: 0;
  }

  .detail-content.card {
     padding: 20px 15px;
     border-radius: 0;
     margin: 0;
     width: 100% !important;
     max-width: 100% !important;
     box-sizing: border-box !important;
     overflow: hidden;
     border-left: none;
     border-right: none;
     background: var(--card-bg);
     box-shadow: none;
  }

  :global(.dark) .detail-content.card {
     background: var(--bg-primary);
  }

  .detail-title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 25px;
    padding-bottom: 20px;
    width: 100%;
    border-bottom: 1px solid var(--border-color);
  }

  .detail-title-section h1 {
     font-size: 1.5rem;
     line-height: 1.3;
     width: 100%;
     overflow-wrap: break-word;
     word-wrap: break-word;
  }

  .title-with-icon {
    gap: 10px;
    width: 100%;
  }

  .project-hero-icon {
    font-size: 2.2rem !important;
  }

  .info-section.box-item, .metric-card, .mini-stat {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 0 10px 0 !important;
    box-sizing: border-box !important;
    padding: 20px !important;
  }

  .stat-mini-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .info-section h3 {
    font-size: 1rem;
    margin-bottom: 12px;
  }
}

.activities-linked-list {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
}

.linked-title {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.activities-linked-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

:global(.dark) .activity-link {
  background: #111112;
}

.activity-link:hover {
  background: var(--button-primary);
  color: white;
  border-color: var(--button-primary);
  transform: translateX(5px);
}

.activity-link span {
  font-size: 1.2rem;
  color: var(--button-primary);
}

.activity-link:hover span {
  color: white;
}
</style>
