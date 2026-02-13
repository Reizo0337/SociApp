<script setup lang="js">

import StatisticsCard from '@/components/StatisticsCard.vue'
import { ref, onMounted, computed } from 'vue'
import Title from '../components/Title.vue'
import ModalForm from '../components/ModalForm.vue'
import ModalDelete from '../components/ModalDelete.vue'
import ModalEdit from '../components/ModalEdit.vue'
import { ActivitySchema } from '@/formSchemas/Activity.schema'

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

onMounted(async () => {
  try {
    // Cargar actividades
    const activitiesResponse = await fetch('http://localhost:3000/activities')
    const activitiesContentType = activitiesResponse.headers.get('content-type')
    if (!activitiesContentType?.includes('application/json')) {
      throw new Error('La respuesta de actividades no es JSON')
    }
    const activitiesData = await activitiesResponse.json()
    activities.value = activitiesData.activities || []

    // Cargar monitores
    const monitorsResponse = await fetch('http://localhost:3000/api/monitors')
    const monitorsContentType = monitorsResponse.headers.get('content-type')
    if (!monitorsContentType?.includes('application/json')) {
      throw new Error('La respuesta de monitores no es JSON')
    }
    const monitorsData = await monitorsResponse.json()
    monitors.value = monitorsData || []
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
const addActivities = () => {
  formError.value = ''
  showAddActivitiesModal.value = true
}
const saveActivity = async (newActivity) => {
  try {
    if (!newActivity.horaInicio || !newActivity.horaFin) {
      throw new Error('Debe seleccionar hora de inicio y fin');
    }

    const response = await fetch('http://localhost:3000/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newActivity)
    });

    if (!response.ok) {
      let errMsg = 'No se pudo guardar la actividad';
      try {
        const errBody = await response.json();
        if (errBody?.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(', ') : errBody.message;
        } else if (errBody?.error) {
          errMsg = errBody.error;
        }
      } catch {}
      formError.value = errMsg;
      return;
    }

    const savedActivity = await response.json();
    activities.value.push(savedActivity)
    showAddActivitiesModal.value = false;
    formError.value = '';
  } catch (error) {
    console.error(error);
    formError.value = error?.message || String(error) || 'No se pudo guardar la actividad';
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

    const res = await fetch(`http://localhost:3000/activities/${payload.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      let errMsg = 'No se pudo actualizar la actividad';
      try {
        const errBody = await res.json();
        if (errBody?.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(', ') : errBody.message;
        } else if (errBody?.error) {
          errMsg = errBody.error;
        }
      } catch {}
      editError.value = errMsg;
      return;
    }

    const updated = await res.json();
    const idx = activities.value.findIndex((a) => a.id === updated.id);
    if (idx !== -1) activities.value.splice(idx, 1, updated);
    showEditModal.value = false;
    editingActivity.value = null;
    editError.value = '';
  } catch (e) {
    editError.value = e?.message || String(e) || 'No se pudo actualizar la actividad';
  }
}

const openDeleteModal = (activity) => {
  activityToDelete.value = activity
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!activityToDelete.value) return
  try {
    const res = await fetch(`http://localhost:3000/activities/${activityToDelete.value.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('No se pudo eliminar la actividad');
    const idx = activities.value.findIndex((a) => a.id === activityToDelete.value.id);
    if (idx !== -1) activities.value.splice(idx, 1);
    showDeleteModal.value = false;
    activityToDelete.value = null;
  } catch (e) {
    alert(e?.message || String(e));
    showDeleteModal.value = false;
    activityToDelete.value = null;
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
          <button @click="addActivities">Agregar Actividad</button>
          <ModalForm :schema="ActivitySchema" :error="formError" @submit="saveActivity" v-if="showAddActivitiesModal" @close="() => { showAddActivitiesModal = false; formError = '' }"/>
          <ModalEdit :schema="ActivitySchema" :initial="editingActivity" :error="editError" @submit="saveEdit" v-if="showEditModal" @close="() => { showEditModal = false; editingActivity = null; editError = '' }"/>
          <ModalDelete :title="'Eliminar Actividad'" :message="'¿Está seguro de que desea eliminar esta actividad? Esta acción no se puede deshacer.'" :itemName="activityToDelete?.name" @confirm="confirmDelete" @close="() => { showDeleteModal = false; activityToDelete = null }" v-if="showDeleteModal"/>
          <input type="text" placeholder="Buscando por actividad... " v-model="searchQuery"/>
        </div>
      </div>

      <div class="users-grid">
        <div v-for="activity in filteredActivities" :key="activity.id" class="user-card">
          <div class="card-header">
            <div class="left">
              <div class="text">
                <h3 :title="activity.name" }}>{{activity.name }}</h3>
              </div>
            </div>
            <div class="right">
              <div class="action-buttons">
                <button @click="editActivity(activity)"><span class="material-symbols-outlined edit">edit</span></button>
                <button @click="openDeleteModal(activity)"><span class="material-symbols-outlined delete">delete</span></button>
              </div>
            </div>
            </div>
          <div class="card-body">
            <p><strong>Lugar de la actividad:</strong> {{ activity.place }}</p>
            <p><strong>Hora de inicio:</strong> {{ activity.horaInicio }} <strong> Hora de fin: </strong> {{activity.horaFin}} </p>
             <p><strong>Monitor:</strong> {{ activity.monitor }} </p>
            <div class="card-actions">
            </div>

          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px 40px;
  min-height: 100vh;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
</style>
