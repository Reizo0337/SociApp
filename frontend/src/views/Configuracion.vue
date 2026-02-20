<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfiguracionStore } from '@/stores/configuracion'
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
import { useNotificationStore } from '../stores/notification';
import ModalDelete from '@/components/ModalDelete.vue'
import SearchInput from '@/components/SearchInput.vue'

const notificationStore = useNotificationStore()
const store = useConfiguracionStore()
// Destructure state from store using storeToRefs to keep reactivity
const {
  asociacionData,
  listaJunta,
  listaRelaciones,
  listaBancos,
  listaDonativos,
  loading
} = storeToRefs(store)

const selectedSection = ref(null)
const showAddUserModal = ref(false)
const editingData = ref(null)
const showEditModal = ref(false)
const editingIndex = ref(null)
const editDatos = ref(null)
const expandedActivity = ref([])
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const searchQuery = ref('')

// Filtered computed lists para las secciones con buscador
const filteredRelaciones = computed(() => {
  if (!searchQuery.value) return listaRelaciones.value
  const q = searchQuery.value.toLowerCase()
  return listaRelaciones.value.filter((rel) =>
    Object.values(rel).some((v) => String(v).toLowerCase().includes(q))
  )
})

const filteredDonativos = computed(() => {
  if (!searchQuery.value) return listaDonativos.value
  const q = searchQuery.value.toLowerCase()
  return listaDonativos.value.filter((item) =>
    Object.values(item).some((v) => String(v).toLowerCase().includes(q))
  )
})

const sectionTitle = {
  junta: 'Junta Directiva',
  relaciones: 'Relaciones Institucionales',
  bancos: 'Bancos',
  donativos: 'Donativos y herencias'
}

const sectionForm = {
  junta: juntaDirectivaSchema,
  relaciones: RelacionesInstitucionalesSchema,
  bancos: bancosSchema,
  donativos: donativosSchema
}

const sectionIdMap = {
  junta: 'id',
  relaciones: 'IdInstitucion',
  bancos: 'ID',
  donativos: 'idDonativo'
}

onMounted(() => {
  store.fetchConfiguracion()
})

const selectSection = async (section) => {
  selectedSection.value = section;
  editingIndex.value = null;
  editingData.value = null;
  searchQuery.value = ''; // Reset búsqueda al cambiar de sección

  if (section === 'junta') {
    await fetchUsuariosSelect();
  }

  await store.fetchSection(section);
};

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
  const index = expandedActivity.value.indexOf(miembro)
  if (index > -1) {
    expandedActivity.value.splice(index, 1)
  } else {
    expandedActivity.value = [miembro]
  }
}

const fetchUsuariosSelect = async () => {
    const usuarios = await store.fetchUsuariosSelect();
    const campo = sectionForm.junta[0].fields.find(f => f.key === 'idUsuario');
    if (campo) campo.options = usuarios;
};

async function openModal() {
  editingIndex.value = null;
  editingData.value = null;

  if (selectedSection.value === 'junta') {
    await fetchUsuariosSelect();
  }
  showAddUserModal.value = true;
}

function openEditDatos() {
  editingIndex.value = null
  editDatos.value = { ...asociacionData.value }
  showEditModal.value = true
}

function editItem(list, index) {
  editingIndex.value = index
  editingData.value = { ...list[index] }
  // Usamos el mismo ModalEdit pero le pasamos el esquema de la sección
  showEditModal.value = true
}

async function deleteItem(list, index) {
  const section = selectedSection.value;
  const item = list[index];
  itemToDelete.value = { ...item, _index: index }; // Guardamos el item y su índice
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;
  
  const section = selectedSection.value;
  const idKey = sectionIdMap[section];
  const itemId = itemToDelete.value[idKey];

  try {
    await store.deleteItem(section, itemId);
    notificationStore.success('Registro eliminado con éxito');
  } catch (error) {
    notificationStore.error('Error al eliminar el registro');
  } finally {
    showDeleteModal.value = false;
    itemToDelete.value = null;
  }
}

async function saveDatosEdit(updatedData) {
  try {
    await store.updateConfiguracion(updatedData);
    showEditModal.value = false
    notificationStore.success('Datos actualizados')
  } catch (err) {
    notificationStore.error('Error al guardar')
  }
}

async function handleSave(data) {
  const section = selectedSection.value;
  const isEditing = editingIndex.value !== null;

  try {
    // Si la data viene del modal de edición general (datos de asociación)
    if (section === 'datos' || !section) {
       await saveDatosEdit(data);
       return;
    }

    if (isEditing) {
      const idKey = sectionIdMap[section];
      const id = editingData.value[idKey];

      if (!id) throw new Error('ID no encontrado');
      // Aseguramos que el id esté en el payload si la sección lo requiere
      const payload = { ...data, [idKey]: id };
      await store.updateItem(section, id, payload);
    } else {
      await store.createItem(section, data);
    }

    showAddUserModal.value = false;
    showEditModal.value = false;
    editingIndex.value = null;
    editingData.value = null;
    notificationStore.success(isEditing ? '¡Actualizado con éxito!' : '¡Agregado con éxito!');
  } catch (error) {
    notificationStore.error('Error al guardar los datos.');
  }
}
</script>

<template>
  <main class="config-app">
    <Title title="Configuración" icon="Settings" />

    <header class="profile-header">
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
        <button class="edit-btn-header" @click="openEditDatos" title="Editar datos de asociación">
          <span class="material-symbols-outlined">edit_square</span>
        </button>
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
          <SearchInput
            v-if="selectedSection === 'relaciones' || selectedSection === 'donativos'"
            placeholder="Buscar..."
            v-model="searchQuery"
          />
          <button class="btn-primary" @click="openModal()">
            Agregar
          </button>
        </div>
      </div>

      <div class="content-placeholder">

        <div v-if="selectedSection === 'junta' && listaJunta.length > 0" class="records-list">
          <h3 class="list-title">Miembros de la Junta</h3>
          <ExpandableListItem
            v-for="(miembro, index) in listaJunta"
            :key="index"
            :expanded="expandedActivity.includes(miembro)"
            @toggle="toggleDetails(miembro)"
          >
          <template #summary-left>
            <span class="activity-name">{{ miembro.Nombre + ' ' + miembro.Apellidos }}</span>
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
            v-for="(rel, index) in filteredRelaciones"
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
                    { label: 'Web', value: rel.Web }
                  ]"
                />
                <ActionButtons
                  showEdit
                  showDelete
                  @edit="editItem(listaRelaciones, listaRelaciones.indexOf(rel))"
                  @delete="deleteItem(listaRelaciones, listaRelaciones.indexOf(rel))"
                />
              </div>
            </template>
          </ExpandableListItem>
          <p v-if="filteredRelaciones.length === 0" class="no-results">Sin resultados para "{{ searchQuery }}"</p>
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
              <span class="activity-name">{{ banco.Nombre }}</span>
            </template>

            <template #details>
              <div class="card-body box-item">
                <DataDisplay
                  :items="[
                    { label: 'Banco', value: banco.Nombre },
                    { label: 'IBAN', value: banco.IBAN },
                    { label: 'SWIFT', value: banco.Swift }
                  ]"
                />
                <ActionButtons
                  showEdit
                  showDelete
                  @edit="editItem(listaBancos, index)"
                  @delete="deleteItem(listaBancos, index)"
                />
              </div>
            </template>
          </ExpandableListItem>
        </div>
        <div v-if="selectedSection === 'donativos' && listaDonativos.length > 0" class="records-list">
          <h3 class="list-title">Registros de Donativos</h3>

          <ExpandableListItem
            v-for="(item, index) in filteredDonativos"
            :key="index"
            :expanded="expandedActivity.includes(item)"
            @toggle="toggleDetails(item)"
          >
            <template #summary-left>
              <span class="activity-name">{{ item.Nombre }}</span>
            </template>

            <template #details>
              <div class="card-body box-item">
                <DataDisplay
                  :items="[
                    { label: 'Nombre/Entidad', value: item.Nombre },
                    { label: 'Tipo', value: item.Tipo },
                    { label: 'NIF/DNI', value: item.NIF }
                  ]"
                />
                <ActionButtons
                  showEdit
                  showDelete
                  @edit="editItem(listaDonativos, listaDonativos.indexOf(item))"
                  @delete="deleteItem(listaDonativos, listaDonativos.indexOf(item))"
                />
              </div>
            </template>
          </ExpandableListItem>
          <p v-if="filteredDonativos.length === 0" class="no-results">Sin resultados para "{{ searchQuery }}"</p>
        </div>
      </div>
    </div>

    <ModalForm
      v-if="showAddUserModal && (selectedSection && sectionForm[selectedSection])"
      :schema="sectionForm[selectedSection]"
      :title="sectionTitle[selectedSection]"
      :initial="selectedSection === 'datos' ? asociacionData : editingData"
      @submit="handleSave"
      @close="showAddUserModal = false"
    />
    <ModalEdit
      v-if="showEditModal"
      :initial="editingIndex !== null ? editingData : editDatos"
      :schema="editingIndex !== null ? sectionForm[selectedSection] : datosSchema"
      :title="editingIndex !== null ? 'Editar Registro' : 'Editar Datos de la Asociación'"
      @submit="handleSave"
      @close="() => { showEditModal = false; editingIndex = null; editingData = null; }"
    />

    <ModalDelete
      v-if="showDeleteModal"
      title="Eliminar Registro"
      message="¿Estás seguro de que quieres eliminar este registro de la configuración?"
      :itemName="itemToDelete?.Nombre || itemToDelete?.nombre || 'este elemento'"
      @confirm="confirmDelete"
      @close="showDeleteModal = false"
    />
  </main>
</template>

<style scoped>
@import '../assets/configuracion.css';
</style>
