<template>
  <main>
    <h2 class="title">Configuración</h2>

    <!-- Dashboard cards -->
    <div class="cards">
      <div class="card yellow" @click="selectSection('datos')">Datos Asociación</div>
      <div class="card green" @click="selectSection('junta'); console.log(sectionForm[selectedSection])">👥 Junta Directiva</div>
      <div class="card purple" @click="selectSection('relaciones')">🤝 Relaciones Institucionales</div>
      <div class="card blue" @click="selectSection('bancos')">🏛️ Bancos</div>
      <div class="card red" @click="selectSection('donativos')">Donativos y herencias</div>
    </div>
    <!-- Sección activa -->
    <div v-if="selectedSection" class="panel">
      <h2>{{ sectionTitle[selectedSection] }}</h2>

      <div class="options">
        <button class="btn-primary"@click="showAddUserModal = true">➕ AGREGAR</button>
      </div>

      <div class="content-placeholder">
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

/* Títulos */
.title {
  font-size: 28px;
  margin-bottom: 20px;
}

/* Grid de Cards */
.cards {
  display: flex;
  margin-top: 20px;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.card {
  width: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  border-radius: 8px;
  padding: 8px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #fff;
}


.card:hover { transform: scale(1.02); }

/* Colores de las cards según tus capturas */
.yellow { background-color: #f1c40f; }
.green { background-color: #6ab04c; }
.purple { background-color: #7d5fff; }
.blue { background-color: #1a0dab; }
.red { background-color: #cf3a3a; }

/* Panel interno */
.panel h2 {
  font-size: 26px;
  margin-bottom: 25px;
}

.options, .actions-footer {
  margin: 20px 0;
}

.actions-footer {
  margin-top: 50px; /* Separación para que quede al final */
  border-top: 1px solid #eee;
  padding-top: 20px;
}

/* Estilo unificado de botones */
.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  color: white;
  min-width: 150px;
  transition: background 0.3s;
    background-color: #2a4ea2;

}

.btn-primary:hover { background-color: #1b3570; }

.btn-secondary {
  background-color: #636e72; /* Un gris profesional, pero con la misma forma */
}

.btn-secondary:hover { background-color: #2d3436; }

.content-placeholder {
  min-height: 200px;
}
</style>
