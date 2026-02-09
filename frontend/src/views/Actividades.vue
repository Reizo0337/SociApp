<script setup lang="js">

import StatisticsCard from '@/components/StatisticsCard.vue'
import { ref, onMounted, computed } from 'vue'
import Title from '../components/Title.vue'
import ModalForm from '../components/ModalForm.vue'
import { ActivitySchema } from '@/formSchemas/Activity.schema'

const activities = ref([])
const searchQuery = ref('')
const showAddActivitiesModal = ref(false)

onMounted(async () => {
  try {
    const response = await fetch('http://192.168.1.49:3000/activities')

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new Error('La respuesta no es JSON')
    }

    const data = await response.json()
    activities.value = data.activities || []
    console.log(data)
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
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
  // On click open pop up where user can add a new users. we will use a new component.
  showAddActivitiesModal.value = true
}
const saveActivity = async (newActivity) => {
  try {
    const response = await fetch('http://192.168.1.49:3000/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newActivity)
    });

    if (!response.ok) throw new Error('Error al guardar la actividad');

    const savedActivity = await response.json(); // backend devuelve la actividad guardada con id
    activities.value.push(savedActivity); // agregamos la actividad con id real
    showAddActivitiesModal.value = false;
  } catch (error) {
    console.error(error);
    alert('No se pudo guardar la actividad');
  }
}
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : ''
</script>

<template>
  <main>
    <Title title="Actividades" icon="Exercise" />
    <div class="showUsers">
      <div class="showUsers-header">
        <h2>Lista de Actividades</h2>
        <div class="options">
          <button @click="addActivities">Agregar Actividad</button>
            <ModalForm :schema="ActivitySchema" @submit="saveActivity" v-if="showAddActivitiesModal" @close="showAddActivitiesModal = false"/>
          <input type="text" placeholder="Buscando por actividad... " v-model="searchQuery"/>
        </div>
      </div>

      <div class="users-grid">
        <div v-for="activity in filteredActivities" :key="activity.id" class="user-card">
          <div class="card-header">
            <div class="icon" v-if="activity.icon != 'null'">
              <span class="material-symbols-outlined">{{ activity.icon }}</span>
            </div>
            <div class="text">
              <h3>{{activity.name }}</h3>
            </div>
          </div>
          <div class="card-body">
            <p><strong>Lugar de la actividad:</strong> {{ activity.place }}</p>
            <p><strong>Horario de la actividad:</strong> {{ activity.horario }}</p>

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

.showUsers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.showUsers-header h2 {
  font-size: 22px;
  color: #333;
}

:global(.dark) .showUsers-header h2 {
  color: #e0e0e0;
}

.showUsers-header input {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 220px;
  font-size: 14px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.user-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

:global(.dark) .user-card {
  background-color: #1e1e1e;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.card-header .text h3 {
  margin: 0;
  font-size: 18px;
  color: #2a4ea2;
}

:global(.dark) .card-header .text h3 {
  color: #63c2de;
}

.card-header .icon span {
  margin: 0;
  color: #2a4ea2;
  text-align: center;
}

.role {
  background-color: #e1e8ff;
  color: #2a4ea2;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 6px;
}

.card-body p {
  margin: 5px 0;
  font-size: 13px;
  color: #555;
}

:global(.dark) .card-body p {
  color: #bbb;
}

.card-body strong {
  color: #333;
}

:global(.dark) .card-body strong {
  color: #e0e0e0;
}

.options {
  display: flex;
  align-items: center;
  gap: 15px;
}

.options button {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #2a4ea2;
  color: #fff;
}

.options button:hover {
  background-color: #1b3570;
}

</style>
