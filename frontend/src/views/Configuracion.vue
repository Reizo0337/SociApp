<template>
  <main class="config-app">
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

      <div class="setting-item" @click="selectSection('datos')">
        <div class="icon-box yellow">🏢</div>
        <div class="setting-info">
          <span class="label">DATOS ASOCIACIÓN</span>
          <span class="value">{{ asociacionData ? 'Registrado' : 'Pendiente de configurar' }}</span>
        </div>
        <span class="arrow">→</span>
      </div>

      <div class="setting-item" @click="selectSection('junta')">
        <div class="icon-box green">👥</div>
        <div class="setting-info">
          <span class="label">JUNTA DIRECTIVA</span>
          <span class="value">Gestión de miembros y cargos</span>
        </div>
        <span class="arrow">→</span>
      </div>

      <div class="setting-item" @click="selectSection('relaciones')">
        <div class="icon-box purple">🤝</div>
        <div class="setting-info">
          <span class="label">RELACIONES INSTITUCIONALES</span>
          <span class="value">Alianzas y convenios externos</span>
        </div>
        <span class="arrow">→</span>
      </div>

      <div class="setting-item" @click="selectSection('bancos')">
        <div class="icon-box blue">🏛️</div>
        <div class="setting-info">
          <span class="label">BANCOS</span>
          <span class="value">Cuentas bancarias y tesorería</span>
        </div>
        <span class="arrow">→</span>
      </div>

      <div class="setting-item" @click="selectSection('donativos')">
        <div class="icon-box red">🎁</div>
        <div class="setting-info">
          <span class="label">DONATIVOS Y HERENCIAS</span>
          <span class="value">Registro de aportaciones y legados</span>
        </div>
        <span class="arrow">→</span>
      </div>

    </section>

    <div v-else class="view-panel">
      <div class="view-header">
        <h2 class="view-title">{{ sectionTitle[selectedSection] }}</h2>
        <p class="view-context">Administra la información correspondiente a {{ sectionTitle[selectedSection].toLowerCase() }}.</p>
      </div>

      <div class="options">
        <button
          v-if="selectedSection === 'datos'"
          class="btn-primary"
          @click="showAddUserModal = true"
        >
          {{ asociacionData ? '📝 EDITAR DATOS ASOCIACIÓN' : '📋 COMPLETAR FORMULARIO' }}
        </button>

        <button
          v-else
          class="btn-primary"
          @click="showAddUserModal = true"
        >
          ➕ AGREGAR
        </button>
      </div>

      <div class="content-placeholder">
        <div v-if="selectedSection === 'datos' && asociacionData" class="data-preview">
          <p><strong>Nombre Legal:</strong> {{ asociacionData.legalName }}</p>
          <p><strong>CIF:</strong> {{ asociacionData.cif }}</p>
        </div>
      </div>

      <div class="actions-footer">
        <button class="btn-secondary" @click="selectedSection = null">← VOLVER AL MENÚ</button>
      </div>

      <ModalForm
        v-if="showAddUserModal && sectionForm[selectedSection]"
        :schema="sectionForm[selectedSection]"
        :title="selectedSection === 'datos' && asociacionData ? 'Editar Información' : 'Nuevo Registro'"
        :initialData="selectedSection === 'datos' ? asociacionData : null"
        @submit="handleSave"
        @close="showAddUserModal = false"
    />
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
const asociacionData = ref(null)
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

function handleSave(data) {
  if (selectedSection.value === 'datos') {
    asociacionData.value = data // Guarda el objeto único
  } else {
    console.log(`Guardado en ${selectedSection.value}:`, data)
  }
  showAddUserModal.value = false
}

</script>
<style scoped>
/* --- ESTILOS MODO CLARO (Base) --- */
.config-app {
  min-height: 100vh;
  color: #162683;
  padding:  10px 60px;
  transition: background-color 0.3s ease;
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
  width: 60px;
  height: 60px;
  background: radial-gradient(rgb(167, 178, 203) 15.97%, rgb(3, 38, 94) 77.73%);  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 24px;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
}

.sub-label {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 5px;
}

.settings-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.setting-item {
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #e2e8f0;
  width: 250px;
}

.setting-item:hover {
  transform: translateY(-2px);
  border-color: #2563eb;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
  font-size: 22px;
}

/* Colores de Iconos (Light) */
.yellow { background: #fffbeb; color: #d97706; }
.green  { background: #f0fdf4; color: #16a34a; }
.purple { background: #faf5ff; color: #7c3aed; }
.blue   { background: #eff6ff; color: #2563eb; }
.red    { background: #fef2f2; color: #dc2626; }

.setting-info { flex-grow: 1; display: flex; flex-direction: column; }
.label { font-size: 12px; color: #2563eb; font-weight: 700; margin-bottom: 2px; }
.value { font-size: 14px; color: #64748b; }
.arrow { color: #cbd5e1; font-size: 20px; }

.view-panel {
  padding: 30px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
  animation: fadeIn 0.3s ease-out;
}

.view-title { font-size: 28px; font-weight: 800; color: hwb(222 16% 25%); margin: 0; }
.view-context { color: #64748b; font-size: 15px; margin-top: 8px; }

.btn-primary {
  background: #2563eb;
  color: white;
  padding: 14px 30px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 40px;
}

.data-preview {
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}

/* --- ESTILOS MODO OSCURO (DARK/BLACK) --- */
:global(.dark) .config-app {
  background-color: #000000;
  color: #f8fafc;
}

:global(.dark) .profile-header {
  background: #1b233d;
  border-color: #2563eb;
}

:global(.dark) .setting-item {
  background-color: #1c1b4b; /* Fondo casi negro para las cards */
  border-color: #111a2a;     /* Borde azul oscuro sutil */
}

:global(.dark) .setting-item:hover {
  background-color: #111111;
  border-color: #3b82f6;
}

:global(.dark) .view-panel {
  background-color: rgb(33, 30, 54);
  border-color: #555772;
}

:global(.dark) .view-title { color: #ffffff; }
:global(.dark) .label { color: #60a5fa; }
:global(.dark) .value, :global(.dark) .view-context { color: #94a3b8; }

:global(.dark) .btn-secondary {
  background: #111111;
  color: #07090b;
  border-color: #334155;
}

:global(.dark) .data-preview {
  background: #050505;
  border-color: #1e293b;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
</style>
