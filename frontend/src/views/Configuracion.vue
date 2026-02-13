<template>
  <main class="config-app">
    <Title title="Configuración" icon="Settings" />

    <header v-if="!selectedSection" class="profile-header">
      <div class="association-card">
        <div class="avatar-circle">
          {{ asociacionData?.legalName?.charAt(0) || 'S' }}
        </div>
        <div class="header-info">
          <h2 class="association-name">
            {{ asociacionData?.legalName || 'Agregue datos de la asociación' }}
          </h2>
          <p v-if="asociacionData" class="sub-label">
            {{ asociacionData.cif }} • {{ asociacionData.generalEmail }}
          </p>
          <p v-else class="sub-label">PANEL DE CONTROL GENERAL</p>
        </div>
      </div>
    </header>

    <section v-if="!selectedSection" class="settings-list">
      <StatisticsCard
        v-for="(title, key) in sectionTitle"
        :key="key"
        @click="selectSection(key)"
        class="setting-item"
      >
        <template #content>
          <div class="icon-box" :class="getColorClass(key)">
            <span class="material-symbols-outlined">
              {{ getIcon(key) }}
            </span>
          </div>
          <div class="setting-info">
            <span class="label">{{ title.toUpperCase() }}</span>
            <span class="value">Gestionar sección</span>
          </div>
        </template>
        <template #actions></template>
      </StatisticsCard>
    </section>

    <div v-else class="view-panel">
      <div class="view-navigation">
        <button class="btn-back" @click="selectedSection = null">
          <span class="material-symbols-outlined">arrow_back</span>
          VOLVER AL MENÚ
        </button>
      </div>

      <div class="view-header">
        <h2 class="view-title">{{ sectionTitle[selectedSection] }}</h2>
        <div class="options">
          <button class="btn-primary" @click="showAddUserModal = true">
            {{ selectedSection === 'datos' && asociacionData ? '📝 EDITAR' : '➕ AGREGAR' }}
          </button>
        </div>
      </div>

      <div class="content-placeholder">
        <div v-if="selectedSection === 'datos' && asociacionData" class="data-preview">
          <p><strong>Nombre Legal:</strong> {{ asociacionData.legalName }}</p>
          <p><strong>CIF:</strong> {{ asociacionData.cif }}</p>
        </div>

        <div v-if="selectedSection === 'junta' && listaJunta.length > 0" class="records-list">
          <h3 class="list-title">Miembros de la Junta</h3>
          <StatisticsCard
            v-for="(miembro, index) in listaJunta"
            :key="index"
            class="record-card"
          >
            <template #content>
              <div class="record-icon">👤</div>
              <div class="record-details">
                <p class="record-main">{{ miembro.nombre }} {{ miembro.apellidos }}</p>
                <p class="record-sub">{{ miembro.cargo || 'Miembro' }}</p>
              </div>
            </template>
            <template #actions>
              <div class="action-buttons">
                <button @click="editMiembro(index)" class="edit-icon">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button @click="deleteItem(listaJunta, index)" class="delete-icon">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </template>
          </StatisticsCard>
        </div>

        <div v-if="selectedSection === 'relaciones' && listaRelaciones.length > 0" class="records-list">
          <h3 class="list-title">Convenios y Relaciones</h3>
          <StatisticsCard v-for="(rel, index) in listaRelaciones" :key="index" class="record-card">
            <template #content>
              <div class="record-icon">🤝</div>
              <div class="record-details">
                <p class="record-main">{{ rel.entidad || rel.nombreInstitucion }}</p>
                <p class="record-sub">{{ rel.tipoRelacion || 'Convenio' }}</p>
              </div>
            </template>
            <template #actions>
              <div class="action-buttons">
                <button @click="editItem(listaRelaciones, index)" class="edit-icon"><span class="material-symbols-outlined">edit</span></button>
                <button @click="deleteItem(listaRelaciones, index)" class="delete-icon"><span class="material-symbols-outlined">delete</span></button>
              </div>
            </template>
          </StatisticsCard>
        </div>

        <div v-if="selectedSection === 'donativos' && listaDonativos.length > 0" class="records-list">
          <h3 class="list-title">Registros de Donativos</h3>
          <StatisticsCard v-for="(item, index) in listaDonativos" :key="index" class="record-card">
            <template #content>
              <div class="record-icon">🎁</div>
              <div class="record-details">
                <p class="record-main">{{ item.donante || 'Donativo Anónimo' }}</p>
                <p class="record-sub">{{ item.tipo || 'General' }} • {{ item.cuantía || item.monto || '' }}</p>
              </div>
            </template>
            <template #actions>
              <div class="action-buttons">
                <button @click="editItem(listaDonativos, index)" class="edit-icon"><span class="material-symbols-outlined">edit</span></button>
                <button @click="deleteItem(listaDonativos, index)" class="delete-icon"><span class="material-symbols-outlined">delete</span></button>
              </div>
            </template>
          </StatisticsCard>
        </div>

        <div v-if="selectedSection === 'bancos' && listaBancos.length > 0" class="records-list">
          <h3 class="list-title">Cuentas Registradas</h3>
          <StatisticsCard
            v-for="(banco, index) in listaBancos"
            :key="index"
            class="record-card"
          >
            <template #content>
              <div class="record-icon">🏛️</div>
              <div class="record-details">
                <p class="record-main">{{ banco.entidad }}</p>
                <p class="record-sub">{{ banco.iban }}</p>
              </div>
            </template>
            <template #actions>
               <button @click="deleteBanco(index)" class="delete-icon">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </template>
          </StatisticsCard>
        </div>
      </div>

      <ModalForm
        v-if="showAddUserModal && sectionForm[selectedSection]"
        :schema="sectionForm[selectedSection]"
        :title="sectionTitle[selectedSection]"
        :initialData="selectedSection === 'datos' ? asociacionData : editingData"
        @submit="handleSave"
        @close="showAddUserModal = false"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ModalForm from '@/components/ModalForm.vue'
import Title from '../components/Title.vue'
import { bancosSchema } from '@/formSchemas/bancos.schema'
import { juntaDirectivaSchema } from '@/formSchemas/juntaDirectiva.schema'
import { RelacionesInstitucionalesSchema } from '@/formSchemas/RelacionesInstitucionales.schema'
import { datosSchema } from '@/formSchemas/datos.schema'
import { donativosSchema } from '@/formSchemas/donativos.schema'
import StatisticsCard from '@/components/StatisticsCard.vue'

const selectedSection = ref(null)
const showAddUserModal = ref(false)
const editingData = ref(null)
const editingIndex = ref(null)
const loading = ref(false) // Para feedback visual

//estados de datos
const asociacionData = ref(null)
const listaBancos = ref([])
const listaJunta = ref([])
const listaDonativos = ref([])
const listaRelaciones = ref([])

const fetchConfiguracion = async () => {
  try {
    const response = await fetch('http://localhost:3000/configuracion/datos');
    if (response.ok) {
      const data = await response.json();
      asociacionData.value = data;
    }
  } catch (error) {
    console.error('Error cargando configuración:', error);
  }
};

onMounted(() => {
  fetchConfiguracion();
});

const sectionTitle = {
  datos: 'Datos Asociación',
  junta: 'Junta Directiva',
  relaciones: 'Relaciones Institucionales',
  bancos: 'Bancos',
  donativos: 'Donativos y herencias'
}
const getIcon = (key) => {
  const icons = {
    datos: 'corporate_fare',
    junta: 'groups',
    relaciones: 'handshake',
    bancos: 'account_balance',
    donativos: 'redeem'
  }
  return icons[key] || 'settings'
}

const getColorClass = (key) => {
  const colors = { datos: 'yellow', junta: 'green', relaciones: 'purple', bancos: 'blue', donativos: 'red' }
  return colors[key] || ''
}

const sectionForm = {
  junta: juntaDirectivaSchema,
  datos: datosSchema,
  relaciones: RelacionesInstitucionalesSchema,
  bancos: bancosSchema,
  donativos: donativosSchema
}

function openModal() {
  editingIndex.value = null
  if (selectedSection.value === 'datos') {
    editingData.value = asociacionData.value
  } else {
    editingData.value = null
  }
  showAddUserModal.value = true
}

function editMiembro(index) {
  editingIndex.value = index
  editingData.value = { ...listaJunta.value[index] }
  showAddUserModal.value = true
}

function selectSection(section) {
  selectedSection.value = section
}

function editItem(list, index) {
  editingIndex.value = index
  editingData.value = { ...list[index] }
  showAddUserModal.value = true
}

function deleteBanco(index) {
  listaBancos.value.splice(index, 1)
}
function deleteItem(list, index) {
  list.splice(index, 1)
}
async function handleSave(data) {
  const section = selectedSection.value

  if (section === 'datos') {
    try {
      loading.value = true;
      const response = await fetch('http://localhost:3000/configuracion/datos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Error al guardar');

      const updatedData = await response.json();
      asociacionData.value = updatedData; // Actualizamos el estado local
      showAddUserModal.value = false;
      alert('¡Configuración guardada con éxito!');
    } catch (error) {
      alert('Error al conectar con el servidor');
      console.error(error);
    } finally {
      loading.value = false;
    }
  } else {
    // Lógica para listas dinámicas
    const listMap = {
      bancos: listaBancos.value,
      junta: listaJunta.value,
      donativos: listaDonativos.value,
      relaciones: listaRelaciones.value
    }

    const targetList = listMap[section]
    if (targetList) {
      if (editingIndex.value !== null) {
        targetList[editingIndex.value] = data
      } else {
        targetList.push(data)
      }
    }
  }
  showAddUserModal.value = false
}
</script>

<style scoped>
.config-app {
  min-height: 100vh;
  color: #162683;
  padding: 10px 60px;
}

.sub-label {
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 5px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 15px;
  border-left: 4px solid #2563eb;
  border-radius: 0 16px 16px 0;
}

.avatar-circle {
  width: 60px; height: 60px;
  background: radial-gradient(rgb(167, 178, 203) 15.97%, rgb(3, 38, 94) 77.73%);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: bold; font-size: 24px;
}

.setting-item :deep(.data) {
  display: flex !important;
  flex-direction: row !important; /* Icono y texto en línea */
  align-items: center !important;
  width: 100%;
}
.setting-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}


/* 5. EL TEXTO A LA DERECHA */
.setting-item .setting-info {
  order: 2 !important; /* Segundo */
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Texto alineado a la derecha */
  text-align: right;
  flex-grow: 1; /* Ocupa todo el espacio para empujar el texto al final */
}

.settings-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

/* --- TARJETAS CON TEXTO A LA DERECHA --- */
.setting-item {
  border-radius: 20px !important;
  padding: 18px;
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  justify-content: flex-start; /* Icono al principio */
  cursor: pointer;
  border: 1px solid #e2e8f0;
  width: 300px;
  height: 100px;
  box-sizing: border-box;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px; /* Espacio a la derecha del icono */
  flex-shrink: 0;
}

/* --- BOTÓN VOLVER (ESTÉTICO Y FUERA) --- */
.view-navigation {
  margin-bottom: 20px;
}

.btn-back {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 0;
  transition: opacity 0.2s;
}

.btn-back:hover {
  opacity: 0.7;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}
.records-list { margin-top: 30px; display: flex; flex-direction: column; gap: 10px; }
.list-title { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
.record-card { width: 100% !important; height: auto !important; padding: 15px !important; border-radius: 12px !important; }
.record-icon { font-size: 24px; margin-right: 15px; }
.record-main { font-weight: 700; color: #1e293b; margin: 0; }
.record-sub { font-size: 13px; color: #64748b; margin: 0; }
.action-buttons { display: flex; gap: 10px; }
.edit-icon { color: #2563eb; background: none; border: none; cursor: pointer; }
.delete-icon { color: #dc2626; background: none; border: none; cursor: pointer; }

/* Colores e Iconos */
.yellow { background: #faf5dd; color: #d97706; }
.green  { background: #f0fdf4; color: #16a34a; }
.purple { background: #faf5ff; color: #7c3aed; }
.blue   { background: #eff6ff; color: #2563eb; }
.red    { background: #fef2f2; color: #dc2626; }
.label { font-size: 11px; color: #2563eb; font-weight: 700; }
.value { font-size: 13px; color: #64748b; }

/* MODO OSCURO */
:global(.dark) .config-app { background-color: #000000; color: #ffffff; }
:global(.dark) .setting-item { background-color: #1a1b26; border-color: #2f334d; }
:global(.dark) .label { color: #7aa2f7; }
:global(.dark) .view-header { border-color: #2f334d; }
:global(.dark) .btn-back { color: #7aa2f7; }

.view-panel {
  padding: 20px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
