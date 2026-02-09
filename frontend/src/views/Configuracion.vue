<template>
  <main>
    <h2 class="title">Configuración</h2>

    <!-- Dashboard cards -->
    <div v-if="!selectedSection" class="cards">
      <div class="card yellow" @click="selectSection('Datos')">Datos Asociación</div>
      <div class="card green" @click="selectSection('junta'); console.log(sectionForm[selectedSection])">👥 Junta Directiva</div>
      <div class="card purple" @click="selectSection('relaciones')">🤝 Relaciones Institucionales</div>
      <div class="card blue" @click="selectSection('bancos')">🏛️ Bancos</div>
      <div class="card red" @click="selectSection('donativos')">Donativos y herencias</div>
    </div>

    <!-- Sección activa -->
    <div v-else class="panel">
      <button @click="selectedSection = null">← VOLVER</button>
      <h2>{{ sectionTitle[selectedSection] }}</h2>
      <div class="options">
        <button @click="showAddUserModal = true">➕ AGREGAR</button>
      </div>

      <transition name="fade-scale">
        <ModalForm
          v-if="showAddUserModal && sectionForm[selectedSection]"
          :schema="sectionForm[selectedSection]"
          @submit=""
          @close="showAddUserModal = false"
        />
      </transition>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import ModalForm from '@/components/ModalForm.vue'
import { bancosSchema } from '@/formSchemas/bancos.schema'
import { juntaDirectivaSchema } from '@/formSchemas/juntaDirectiva.schema'
import { RelacionesInstitucionalesSchema } from '@/formSchemas/RelacionesInstitucionales.schema'
import { datosSchema } from '@/formSchemas/datos.schema'
import { donativosSchema } from '@/formSchemas/donativos.schema'

const selectedSection = ref(null)
const showAddUserModal = ref(false)

const sectionTitle = {
  junta: 'Junta Directiva',
  datos: 'Datos Asociación',
  relaciones: 'Relaciones Institucionales',
  bancos: 'Bancos',
  donativos: 'Donativos y herencias'
}

const sectionForm = {
  junta: juntaDirectivaSchema,
  datos: datosSchema,
  relaciones: RelacionesInstitucionalesSchema,
  bancos: bancosSchema,
  donativos: donativosSchema
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
.blue {background: #240bcb; }
.red {background: #db1a37; }


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
