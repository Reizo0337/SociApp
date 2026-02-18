<script setup lang="js">

import StatisticsCard from '@/components/StatisticsCard.vue'
import { ref, onMounted, computed, watch } from 'vue'
import Title from '../components/Title.vue'
import ActivityModal from '../components/ActivityModal.vue'
import ModalDelete from '../components/ModalDelete.vue'
import ExpandableListItem from '../components/ExpandableListItem.vue'
import ActionButtons from '../components/ActionButtons.vue'
import DataDisplay from '../components/DataDisplay.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import SearchInput from '../components/SearchInput.vue'
import { ActivitySchema } from '@/formSchemas/Activity.schema'
import { useActivityStore } from '@/stores/activities'

const activityStore = useActivityStore()
const activities = computed(() => activityStore.activities)
const searchQuery = ref('')
const showAddActivitiesModal = ref(false)
const formError = ref('')
const showDeleteModal = ref(false)
const activityToDelete = ref(null)
const showEditModal = ref(false)
const editingActivity = ref(null)
const editError = ref('')
const isSubmitting = ref(false)
const expandedActivity = ref([])
const currentPage = ref(1)
const itemsPerPage = 20

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredActivities.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredActivities.value.length / itemsPerPage))

const showingRange = computed(() => {
  if (filteredActivities.value.length === 0) return '0 - 0'
  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(start + itemsPerPage - 1, filteredActivities.value.length)
  return `${start} - ${end}`
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

onMounted(async () => {
  await activityStore.fetchActivities()
})
const filteredActivities = computed(() => {
  if (!searchQuery.value) return activities.value
  return activities.value.filter(activity =>
    Object.values(activity).some(val =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
})

watch(filteredActivities, (newActivities) => {
  if (searchQuery.value) {
    expandedActivity.value = [...newActivities]
  } else {
    expandedActivity.value = []
  }
})

watch(searchQuery, () => {
  currentPage.value = 1
})

const addActivities = () => {
  formError.value = ''
  showAddActivitiesModal.value = true
}
const saveActivity = async (newActivity) => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    if (!newActivity.horaInicio || !newActivity.horaFin) {
      throw new Error('Debe seleccionar hora de inicio y fin');
    }

    await activityStore.addActivity(newActivity);
    showAddActivitiesModal.value = false;
    formError.value = '';
  } catch (error) {
    console.error(error);
    const errMsg = error.response?.data?.message || error.response?.data?.error || error?.message || 'No se pudo guardar la actividad';
    formError.value = Array.isArray(errMsg) ? errMsg.join(', ') : errMsg;
  } finally {
    isSubmitting.value = false;
  }
}
const editActivity = (activity) => {
  editingActivity.value = { ...activity }; // Crear una copia para evitar mutaciones
  showEditModal.value = true
}

const saveEdit = async (payload) => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    if (!payload.horaInicio || !payload.horaFin) {
      throw new Error('Debe seleccionar hora de inicio y fin');
    }

    const id = payload.id || editingActivity.value.id;
    if (!id) throw new Error('ID de la actividad no encontrado');

    await activityStore.updateActivity(id, payload);
    showEditModal.value = false;
    editingActivity.value = null;
    editError.value = '';
  } catch (e) {
    const errMsg = e.response?.data?.message || e.response?.data?.error || e?.message || String(e) || 'No se pudo actualizar la actividad';
    editError.value = Array.isArray(errMsg) ? errMsg.join(', ') : errMsg;
  } finally {
    isSubmitting.value = false;
  }
}

const openDeleteModal = (activity) => {
  activityToDelete.value = activity
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!activityToDelete.value) return
  try {
    await activityStore.removeActivity(activityToDelete.value.id);
    showDeleteModal.value = false;
    activityToDelete.value = null;
  } catch (e) {
    const errMsg = e.response?.data?.message || e?.message || String(e) || 'No se pudo eliminar la actividad';
    alert(errMsg);
    showDeleteModal.value = false;
    activityToDelete.value = null;
  }
}
const toggleDetails = (activity) => {
  if (expandedActivity.value.includes(activity) && expandedActivity.value.length === 1) {
    expandedActivity.value = []
  } else {
    expandedActivity.value = [activity]
  }
}
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '')
</script>

<template>
  <main>
    <Title title="Actividades" icon="Exercise" />
    <div class="showUsers">
      <div class="showUsers-header">
        <h2>Lista de Actividades</h2>
        <div class="options">
          <div class="pagination-controls" v-if="filteredActivities.length > 0">
            <span>{{ showingRange }} de {{ filteredActivities.length }}</span>
            <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <PrimaryButton @click="addActivities">Agregar Actividad</PrimaryButton>
          <ActivityModal :schema="ActivitySchema" :error="formError" :loading="isSubmitting" @submit="saveActivity" v-if="showAddActivitiesModal" @close="() => { showAddActivitiesModal = false; formError = '' }"/>
          <ActivityModal :title="'Editar Actividad'" :schema="ActivitySchema" :initial="editingActivity" :error="editError" :loading="isSubmitting" @submit="saveEdit" v-if="showEditModal" @close="() => { showEditModal = false; editingActivity = null; editError = '' }"/>
          <ModalDelete :title="'Eliminar Actividad'" :message="'¿Está seguro de que desea eliminar esta actividad? Esta acción no se puede deshacer.'" :itemName="activityToDelete?.name" @confirm="confirmDelete" @close="() => { showDeleteModal = false; activityToDelete = null }" v-if="showDeleteModal"/>
          <SearchInput placeholder="Buscando por actividad..." v-model="searchQuery"/>
        </div>
      </div>

      <div class="activities-list">
        <ExpandableListItem
          v-for="(activity, index) in paginatedActivities"
          :key="activity.id || activity._id || index"
          :expanded="expandedActivity.includes(activity)"
          @toggle="toggleDetails(activity)"
        >
          <template #summary-left>
            <span class="activity-name">{{ activity.name }}</span>
          </template>
          <template #details>
            <div class="card-body box-item">
              <DataDisplay
                :items="[
                  { label: 'Lugar de la actividad', value: activity.place },
                  { label: 'Hora de inicio', value: activity.horaInicio },
                  { label: 'Hora de fin', value: activity.horaFin },
                  { label: 'Monitor', value: activity.monitor },
                  { label: 'Proyecto', value: activity.proyecto?.nombre} 

                ]"
              />
              <ActionButtons
                showEdit
                showDelete
                @edit="editActivity(activity)"
                @delete="openDeleteModal(activity)"
              />
            </div>
          </template>
        </ExpandableListItem>
      </div>
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

@media (max-width: 768px) {
  main {
    padding: 20px 15px;
  }
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.activity-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.between {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.showUsers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.options {
  display: flex;
  align-items: center;
  gap: 15px;
}

@media (max-width: 768px) {
  .showUsers-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
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
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

@media (max-width: 480px) {
  .pagination-controls {
    justify-content: space-between;
    width: 100%;
  }
}

.options button.page-btn {
  padding: 5px;
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;
}

.options button.page-btn:hover {
  background-color: var(--button-secondary-hover);
}

.options button.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
