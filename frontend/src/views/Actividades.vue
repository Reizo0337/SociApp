<script setup lang="ts">

import StatisticsCard from '@/components/StatisticsCard.vue'
import { ref, onMounted, computed } from 'vue'
import Title from '../components/Title.vue'
import ModalForm from '../components/ModalForm.vue'
import { userSchema } from '@/formSchemas/user.schema'

const activities = ref([])
const searchQuery = ref('')
const showAddUserModal = ref(false)

onMounted(async () => {
  try {
    const response = await fetch('http://192.168.1.40:3000/activities')

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new Error('La respuesta no es JSON')
    }

    const data = await response.json()
    activities.value = data.activities || []
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

</script>

<template>
  <section>
    <h1>Actividades</h1>
    <p>Gestiona todas las actividades de la asociación desde esta vista.</p>
    <div class="actividades">
      <StatisticsCard
        type="activity"
        title="Crear una nueva actividad"
        data="Pulsa aqui para crear una nueva actividad"
        icon="add"
        color="green"
      />
      <StatisticsCard
        type="activity"
        title="Eliminar una actividad"
        data="Pulsa aqui para eliminar actividad"
        icon="delete"
        color="red"
      />
      <StatisticsCard
        type="activity"
        title="Editar una actividad"
        data="Pulsa aqui para editar una actividad"
        icon="edit"
        color="#34b1eb"
      />
    </div>
      <h2>Actividades actuales</h2>
      <p>A continuación se muestran las actividades actuales de la asociación.</p>

    <div class="actividades">
      <StatisticsCard
        type="activity"
        title="Natacion pa abuelos"
        data="10 inscritos"
        localizacion="Piscina municipal de Delicias"
        icon="pool"
        color="#34b1eb"
      />
      <StatisticsCard
        type="activity"
        title="Curso de ingles"
        data="25 inscritos"
        localizacion="Sala 3"
        icon="book"
        color="#4CAF50"
      />
      <StatisticsCard
        type="activity"
        title="Gimnasia para personas mayores"
        data="22 inscritos"
        localizacion="Sala 3"
        icon="exercise"
        color="#ebcd34"
      />


      <StatisticsCard
        type="activity"
        title="Yoga para personas mayores"
        data="18 inscritos"
        localizacion="Sala 1"
        icon="self_improvement"
        color="#9c27b0"
      />
      <StatisticsCard
        type="activity"
        title="Taller de manualidades"
        data="30 inscritos"
        localizacion="Sala 2"
        icon="handyman"
        color="#ff5722"
      />
       <StatisticsCard
        type="activity"
        title="Uso basico de ordenador para personas mayores"
        data="7 inscritos"
        localizacion="Sala 3"
        icon="computer"
        color="black"
      />
       <StatisticsCard
        type="activity"
        title="Clases de español para extranjeros"
        data="30 inscritos"
        localizacion="Sala 2"
        icon="school"
        color="red"
      />
       <StatisticsCard
        type="activity"
        title="Clases de cocina"
        data="20 inscritos"
        localizacion="Cocina"
        icon="cooking"
        color="purple"
      />
       <StatisticsCard
        type="activity"
        title="Ajedrez"
        data="8 inscritos"
        localizacion="Sala 3"
        icon="chess"
        color="green"
      />
    </div>
  </section>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.actividades {
  display: flex;         /* importante para flexbox */
  flex-wrap: wrap;       /* permite que los elementos se vayan a otra fila */
  justify-content: center; /* centra horizontalmente */
  gap: 1rem;             /* separa las cards entre sí */
  padding: 1rem;         /* opcional, espacio interno */
}
.actividades > * {
  flex: 1 1 300px; /* mínimo 300px, crece si hay espacio */
  max-width: 400px; /* opcional, para que no se hagan demasiado grandes */
}

</style>
