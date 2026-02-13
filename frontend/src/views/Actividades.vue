<script setup lang="js">

import StatisticsCard from '@/components/StatisticsCard.vue'
import { ref, onMounted, computed, watch } from 'vue'
import Title from '../components/Title.vue'
import ModalForm from '../components/ModalForm.vue'
import ModalDelete from '../components/ModalDelete.vue'
import ModalEdit from '../components/ModalEdit.vue'
import ExpandableListItem from '../components/ExpandableListItem.vue'
import ActionButtons from '../components/ActionButtons.vue'
import DataDisplay from '../components/DataDisplay.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import SearchInput from '../components/SearchInput.vue'
import { ActivitySchema } from '@/formSchemas/Activity.schema'
import { api } from '@/api'

const activities = ref([])
const monitors = ref([]) // Lista de monitores
const searchQuery = ref('')
const showAddActivitiesModal = ref(false)
const formError = ref('')
const showDeleteModal = ref(false)
const activityToDelete = ref(null)
const showEditModal = ref(false)
const editingActivity = ref(null)
const editError = ref('')
const expandedActivity = ref([])

onMounted(async () => {
  try {
    // Cargar actividades
    const response = await api.get('/activities')
    activities.value = response.data.activities || []
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
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

const addActivities = () => {
  formError.value = ''
  showAddActivitiesModal.value = true
}
const saveActivity = async (newActivity) => {
  try {
    if (!newActivity.horaInicio || !newActivity.horaFin) {
      throw new Error('Debe seleccionar hora de inicio y fin');
    }

    const response = await api.post('/activities', newActivity);
    const savedActivity = response.data;
    activities.value.push(savedActivity)
    showAddActivitiesModal.value = false;
    formError.value = '';
  } catch (error) {
    console.error(error);
    const errMsg = error.response?.data?.message || error.response?.data?.error || error?.message || 'No se pudo guardar la actividad';
    formError.value = Array.isArray(errMsg) ? errMsg.join(', ') : errMsg;
  }
}
const editActivity = (activity) => {
  editingActivity.value = { ...activity }; // Crear una copia para evitar mutaciones
  showEditModal.value = true
}

const saveEdit = async (payload) => {
  try {
    if (!payload.horaInicio || !payload.horaFin) {
      throw new Error('Debe seleccionar hora de inicio y fin');
    }

    const res = await api.put(`/activities/${payload.id}`, payload);
    const updated = res.data;
    const idx = activities.value.findIndex((a) => a.id === updated.id);
    if (idx !== -1) activities.value.splice(idx, 1, updated);
    showEditModal.value = false;
    editingActivity.value = null;
    editError.value = '';
  } catch (e) {
    const errMsg = e.response?.data?.message || e.response?.data?.error || e?.message || String(e) || 'No se pudo actualizar la actividad';
    editError.value = Array.isArray(errMsg) ? errMsg.join(', ') : errMsg;
  }
}

const openDeleteModal = (activity) => {
  activityToDelete.value = activity
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!activityToDelete.value) return
  try {
    await api.delete(`/activities/${activityToDelete.value.id}`);
    const idx = activities.value.findIndex((a) => a.id === activityToDelete.value.id);
    if (idx !== -1) activities.value.splice(idx, 1);
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
          <PrimaryButton @click="addActivities">Agregar Actividad</PrimaryButton>
          <ModalForm :schema="ActivitySchema" :error="formError" @submit="saveActivity" v-if="showAddActivitiesModal" @close="() => { showAddActivitiesModal = false; formError = '' }"/>
          <ModalEdit :schema="ActivitySchema" :initial="editingActivity" :error="editError" @submit="saveEdit" v-if="showEditModal" @close="() => { showEditModal = false; editingActivity = null; editError = '' }"/>
          <ModalDelete :title="'Eliminar Actividad'" :message="'¿Está seguro de que desea eliminar esta actividad? Esta acción no se puede deshacer.'" :itemName="activityToDelete?.name" @confirm="confirmDelete" @close="() => { showDeleteModal = false; activityToDelete = null }" v-if="showDeleteModal"/>
          <SearchInput placeholder="Buscando por actividad..." v-model="searchQuery"/>
        </div>
      </div>

      <div class="activities-list">
        <ExpandableListItem
          v-for="(activity, index) in filteredActivities"
          :key="activity.id || activity._id || index"
          :expanded="expandedActivity.includes(activity)"
          @toggle="toggleDetails(activity)"
        >
          <template #summary-left>
            <span class="activity-name">{{ activity.name }}</span>
          </template>
          <template #details>
            <div class="card-body between">
              <DataDisplay
                :items="[
                  { label: 'Lugar de la actividad', value: activity.place },
                  { label: 'Hora de inicio', value: activity.horaInicio },
                  { label: 'Hora de fin', value: activity.horaFin },
                  { label: 'Monitor', value: activity.monitor }
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
</style>
