<template>
  <main>
    <h2 class="title">Configuración</h2>

    <!-- Dashboard cards -->
    <div v-if="!selectedSection" class="cards">
      <div class="card green" @click="selectSection('junta')">👥 Junta Directiva</div>
      <div class="card yellow" @click="selectSection('organismos')">🏛️ Otros Organismos</div>
      <div class="card purple" @click="selectSection('relaciones')">🤝 Relaciones Institucionales</div>
    </div>

    <!-- Sección activa -->
    <div v-else class="panel">
      <button @click="selectedSection = null">← VOLVER</button>
      <h2>{{ sectionTitle[selectedSection] }}</h2>

      <!-- Botón para agregar usuario -->
      <div class="options">
        <button @click="showAddUserModal = true">➕ AGREGAR</button>
      </div>

      <!-- Modal para registrar junta directiva -->
      <transition name="fade-scale">
        <ModalForm
          v-if="showAddUserModal"
          :schema="juntaDirectiva"
          @submit="saveUser"
          @close="showAddUserModal = false"
        />
      </transition>

    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import ModalForm from '@/components/ModalForm.vue'
//import { juntaDirectiva } from '@/formSchemas/juntaDirectiva'
//import { OtrosOrganismos } from '@/formSchemas/OtrosOrganismos'
//import { RelacionesInstitucionales } from '@/formSchemas/RelacionesInstitucionales'


const selectedSection = ref(null)
const showAddUserModal = ref(false)

const sectionTitle = {
  junta: 'Junta Directiva',
  organismos: 'Otros Organismos',
  relaciones: 'Relaciones Institucionales'
}

function selectSection(section) {
  selectedSection.value = section
}

function saveUser(data) {
  console.log(`Usuario registrado en ${sectionTitle[selectedSection.value]}:`, data)
  showAddUserModal.value = false
}
</script>

<style scoped>
main {
  padding: 20px 40px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card {
  padding: 30px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  font-size: 18px;
}

.green { background: #4caf50; }
.yellow { background: #ffc107; }
.purple { background: #7e57c2; }

.panel {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-top: 20px;
}

.options {
  margin: 20px 0;
}

.options button {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #2a4ea2;
  color: white;
}

.options button:hover {
  background-color: #1b3570;
}
</style>
