<template>
  <main class="config-app">
    <Title title="Configuración" icon="Settings" />

    <header v-if="!selectedSection" class="profile-header">
      <div class="association-card">
        <div class="avatar-circle">
          {{ asociacionData?.Nombre?.charAt(0) || 'S' }}
        </div>
        <div class="header-info">
          <h2 class="association-name">
            {{ asociacionData?.Nombre || 'Agregue datos de la asociación' }}
          </h2>
          <p v-if="asociacionData" class="sub-label">
            {{ asociacionData.CIF }} • {{ asociacionData.Email }}
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
          <button class="btn-primary" @click="selectedSection === 'datos' ? openEditDatos() : openModal()"
>
            {{ selectedSection === 'datos' && asociacionData ? '📝 EDITAR' : '➕ AGREGAR' }}
          </button>
        </div>
      </div>

      <div class="content-placeholder">
        <div v-if="selectedSection === 'datos' && asociacionData" class="data-preview">
          <p><strong>Nombre Legal:</strong> {{ asociacionData.Nombre }}</p>
          <p><strong>CIF:</strong> {{ asociacionData.CIF }}</p>
        </div>

        <div v-if="selectedSection === 'junta' && listaJunta.length > 0" class="records-list">
          <h3 class="list-title">Miembros de la Junta</h3>
            <ExpandableListItem
          v-for="(miembro, index) in listaJunta"
          :key="index"
          :expanded="expandedActivity.includes(miembro)"
          @toggle="toggleDetails(miembro)"
        >
          <template #summary-left>
            <span class="activity-name">{{ miembro.Nombre + miembro.Apellidos }}</span>
          </template>
          <template #details>
            <div class="card-body box-item between">
              <DataDisplay
                :items="[
                  { label: 'Nombre', value: miembro.Nombre },
                  { label: 'Apellido', value: miembro.Apellidos },
                  { label: 'Cargo', value: miembro.cargo },
                ]"
              />
              <ActionButtons
                showEdit
                showDelete
                @edit="editItem(listaJunta, index)"
                @delete="deleteItem(listaJunta, index)"
              />
            </div>
          </template>
        </ExpandableListItem>
          
        </div>

        <div v-if="selectedSection === 'relaciones' && listaRelaciones.length > 0" class="records-list">
          <h3 class="list-title">Convenios y Relaciones</h3>

          <ExpandableListItem
            v-for="(rel, index) in listaRelaciones"
            :key="index"
            :expanded="expandedActivity.includes(rel)"
            @toggle="toggleDetails(rel)"
          >
            <template #summary-left>
              <span class="activity-name">{{ rel.Nombre }}</span>
            </template>

            <template #details>
              <div class="card-body box-item">
                <DataDisplay
                  :items="[
                    { label: 'Nombre', value: rel.Nombre },
                    { label: 'Email', value: rel.Email },
                    { label: 'Teléfono', value: rel.Telefono }
                  ]"
                />
                <ActionButtons
                  showEdit
                  showDelete
                  @edit="editItem(listaRelaciones, index)"
                  @delete="deleteItem(listaRelaciones, index)"
                />
              </div>
            </template>
          </ExpandableListItem>
        </div>


        <div v-if="selectedSection === 'donativos' && listaDonativos.length > 0" class="records-list">
          <h3 class="list-title">Registros de Donativos</h3>

          <ExpandableListItem
            v-for="(item, index) in listaDonativos"
            :key="index"
            :expanded="expandedActivity.includes(item)"
            @toggle="toggleDetails(item)"
          >
            <template #summary-left>
              <span class="activity-name">
                {{ item.donante || 'Donativo Anónimo' }}
              </span>
            </template>

            <template #details>
              <div class="card-body box-item">
                <DataDisplay
                  :items="[
                    { label: 'Donante', value: item.donante || 'Anónimo' },
                    { label: 'Tipo', value: item.tipo },
                    { label: 'Monto', value: item.cuantía || item.monto }
                  ]"
                />
                <ActionButtons
                  showEdit
                  showDelete
                  @edit="editItem(listaDonativos, index)"
                  @delete="deleteItem(listaDonativos, index)"
                />
              </div>
            </template>
          </ExpandableListItem>
        </div>


        <div v-if="selectedSection === 'bancos' && listaBancos.length > 0" class="records-list">
          <h3 class="list-title">Cuentas Registradas</h3>

          <ExpandableListItem
            v-for="(banco, index) in listaBancos"
            :key="index"
            :expanded="expandedActivity.includes(banco)"
            @toggle="toggleDetails(banco)"
          >
            <template #summary-left>
              <span class="activity-name">{{ banco.entidad }}</span>
            </template>

            <template #details>
              <div class="card-body box-item">
                <DataDisplay
                  :items="[
                    { label: 'Entidad', value: banco.entidad },
                    { label: 'IBAN', value: banco.iban }
                  ]"
                />
                <ActionButtons
                  showDelete
                  @delete="deleteBanco(index)"
                />
              </div>
            </template>
          </ExpandableListItem>
        </div>
      </div>


      <ModalForm
        v-if="showAddUserModal && sectionForm[selectedSection]"
        :schema="sectionForm[selectedSection]"
        :title="sectionTitle[selectedSection]"
        :initial="selectedSection === 'datos' ? asociacionData : editingData"
        @submit="handleSave"
        @close="showAddUserModal = false"
      />
      <ModalEdit
        v-if="showEditModal"
        :data="editDatos"
        title="Editar Datos Asociación"
        @save="saveDatosEdit"
        @close="showEditModal = false"
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
import ModalEdit from '@/components/ModalEdit.vue'
import ExpandableListItem from '@/components/ExpandableListItem.vue'
import DataDisplay from '@/components/DataDisplay.vue'
import ActionButtons from '@/components/ActionButtons.vue'


const selectedSection = ref(null)
const showAddUserModal = ref(false)
const editingData = ref(null)
const showEditModal = ref(false)
const editingIndex = ref(null)
const editDatos = ref(null)
const loading = ref(false) // Para feedback visual
const expandedActivity = ref([])

//estados de datos
const asociacionData = ref(null)
const listaBancos = ref([])
const listaJunta = ref([])
const listaDonativos = ref([])
const listaUsuariosParaSelect = ref([])
const listaRelaciones = ref([])

// 3. Modificamos el selectSection para que cargue los usuarios si entramos en 'junta'
const selectSection = (section) => {
  selectedSection.value = section;
  
  // Limpiamos datos anteriores para que no se mezclen
  editingIndex.value = null;
  editingData.value = null;

  // Carga automática al entrar en la sección
  if (section === 'junta') {
    fetchUsuariosSelect();
    fetchJunta();
  } else {
    fetchSection(section);
  }
};

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
const toggleDetails = (miembro) => {
  if (expandedActivity.value.includes(miembro) && expandedActivity.value.length === 1) {
    expandedActivity.value = []
  } else {
    expandedActivity.value = [miembro]
  }
}

const fetchJunta = async () => {
  const res = await fetch('http://localhost:3000/configuracion/junta');
  listaJunta.value = await res.json();
};
onMounted(() => {
  fetchConfiguracion();
  fetchJunta();
});

const sectionForm = {
  junta: juntaDirectivaSchema,
  datos: datosSchema,
  relaciones: RelacionesInstitucionalesSchema,
  bancos: bancosSchema,
  donativos: donativosSchema
}

const fetchUsuariosSelect = async () => {
  try {
    const res = await fetch('http://localhost:3000/configuracion/junta/usuarios-lista');
    const data = await res.json();
    
    const opcionesMapeadas = data.map(u => ({
      label: `${u.Nombre} ${u.Apellidos}`,
      value: u.idUsuario
    }));

    // Accedemos al primer elemento del array (la sección) y buscamos el campo
    const seccion = sectionForm.junta[0]; 
    const campo = seccion.fields.find(f => f.key === 'idUsuario');
    
    if (campo) {
      campo.options = opcionesMapeadas;
    }
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
};

async function openModal() {
  editingIndex.value = null;
  editingData.value = null;

  if (selectedSection.value === 'junta') {
    // Abrimos el modal PRIMERO para dar feedback visual, 
    // o aseguramos que la carga no bloquee la interfaz
    try {
      await fetchUsuariosSelect();
      showAddUserModal.value = true;
    } catch (error) {
      console.error("Error al preparar el formulario de junta:", error);
      alert("Error al cargar la lista de usuarios");
    }
  } else {
    showAddUserModal.value = true;
  }
}
function openEditDatos() {
  editDatos.value = { ...asociacionData.value } // copia editable
  showEditModal.value = true
}

function editMiembro(index) {
  editingIndex.value = index
  const miembro = listaJunta.value[index]
  editingData.value = { ...miembro }
  showAddUserModal.value = true
}

function editItem(list, index) {
  editingIndex.value = index
  editingData.value = { ...list[index] }
  showAddUserModal.value = true
}

function deleteBanco(index) {
  listaBancos.value.splice(index, 1)
}
async function deleteItem(list, index) {
  if (!confirm('¿Estás seguro de eliminar este registro?')) return;
  
  const section = selectedSection.value;
  const item = list[index];
  
  // Determine the ID field based on section
  let id;
  if (section === 'junta') {
    id = item.id;
  } else if (section === 'relaciones') {
    id = item.IdInstitucion;
  } else if (section === 'donativos') {
    id = item.id;
  } else if (section === 'bancos') {
    id = item.id;
  }
  
  if (!id) {
    alert('No se pudo identificar el ID del registro');
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:3000/configuracion/${endpoints[section]}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Error al eliminar');
    
    // Refresh the list
    await fetchSection(section);
    alert('Registro eliminado con éxito ✅');
  } catch (error) {
    console.error(error);
    alert('Error al eliminar el registro');
  }
}

async function saveDatosEdit(updatedData) {
  try {
    const res = await fetch('http://localhost:3000/configuracion/datos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })

    const data = await res.json()

    asociacionData.value = data
    showEditModal.value = false

    alert('Datos actualizados ✅')
  } catch (err) {
    console.error(err)
    alert('Error al guardar')
  }
}

async function deleteJunta(id) {
  await fetch(`/configuracion/junta/${id}`, {
    method: 'DELETE'
  });

  fetchJunta();
}
const endpoints = {
  datos: 'datos',
  junta: 'junta',
  bancos: 'bancos',
  relaciones: 'relaciones',
  donativos: 'donativos'
};

async function fetchSection(section) {
  try {
    const res = await fetch(`http://localhost:3000/configuracion/${endpoints[section]}`);
    const data = await res.json();
    
    // Mapeo dinámico para evitar tantos 'if'
    const listMap = {
      junta: listaJunta,
      bancos: listaBancos,
      relaciones: listaRelaciones,
      donativos: listaDonativos
    };
    
    if (listMap[section]) {
      listMap[section].value = data;
    }
  } catch (error) {
    console.error(`Error cargando ${section}:`, error);
  }
}

async function handleSave(data) {
  console.log("Datos a enviar:", data);
  const section = selectedSection.value;
  const isEditing = editingIndex.value !== null;
  
  try {
    loading.value = true;
    
    let url = `http://localhost:3000/configuracion/${endpoints[section]}`;
    let method = 'POST';
    
    // If editing, use PUT and append the ID
    if (isEditing) {
      method = 'PUT';
      const item = editingData.value;
      
      // Determine the ID field based on section
      let id;
      if (section === 'junta') {
        id = item.id;
      } else if (section === 'relaciones') {
        id = item.IdInstitucion;
      } else if (section === 'donativos') {
        id = item.id;
      } else if (section === 'bancos') {
        id = item.id;
      }
      
      if (!id) {
        throw new Error('No se pudo identificar el ID del registro');
      }
      
      url = `${url}/${id}`;
    }
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Error en la base de datos');

    // Refresh the list
    await fetchSection(section); 

    showAddUserModal.value = false;
    editingIndex.value = null;
    editingData.value = null;
    
    alert(isEditing ? '¡Registro actualizado con éxito! ✅' : '¡Registro agregado con éxito! 🎉');
  } catch (error) {
    console.error(error);
    alert('No se pudo guardar en la base de datos. Revisa la consola del servidor.');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.config-app {
  min-height: 100vh;
  color: var(--text-primary);
  padding: 10px 60px;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.sub-label {
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 5px;
  transition: color 0.3s ease;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 15px;
  border-left: 4px solid var(--button-primary);
  border-radius: 0 16px 16px 0;
  background-color: var(--bg-secondary);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.association-name {
  color: var(--text-primary);
  transition: color 0.3s ease;
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
  box-shadow: 0 8px 20px var(--card-shadow-hover);
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
  width: 70px;
  height: 70px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* --- BOTÓN VOLVER (ESTÉTICO Y FUERA) --- */
.view-navigation {
  margin-bottom: 20px;
}

.btn-back {
  background: none;
  border: none;
  color: var(--button-primary);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 0;
  transition: opacity 0.2s, color 0.3s ease;
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
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.view-title {
  color: var(--text-primary);
  transition: color 0.3s ease;
}
.records-list { margin-top: 30px; display: flex; flex-direction: column; gap: 10px; }
.list-title { 
  font-size: 16px; 
  font-weight: 700; 
  color: var(--text-primary); 
  margin-bottom: 10px;
  transition: color 0.3s ease;
}
.record-card { 
  width: 100% !important; 
  height: auto !important; 
  padding: 15px !important; 
  border-radius: 12px !important;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}
.record-icon { font-size: 24px; margin-right: 15px; }
.record-main { 
  font-weight: 700; 
  color: var(--text-primary); 
  margin: 0;
  transition: color 0.3s ease;
}
.record-sub { 
  font-size: 13px; 
  color: var(--text-secondary); 
  margin: 0;
  transition: color 0.3s ease;
}
.action-buttons { display: flex; gap: 10px; }
.edit-icon { color: #2563eb; background: none; border: none; cursor: pointer; }
.delete-icon { color: #dc2626; background: none; border: none; cursor: pointer; }

/* Colores e Iconos */
.yellow { background: #faf5dd; color: #d97706; }
.green  { background: #f0fdf4; color: #16a34a; }
.purple { background: #faf5ff; color: #7c3aed; }
.blue   { background: #eff6ff; color: #2563eb; }
.red    { background: #fef2f2; color: #dc2626; }
.label { 
  font-size: 11px; 
  color: var(--button-primary); 
  font-weight: 700;
  transition: color 0.3s ease;
}
.value { 
  font-size: 13px; 
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.view-panel {
  padding: 20px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  animation: fadeIn 0.3s ease-out;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.between {
  display: flex;
  justify-content: space-between;
  
}
</style>
