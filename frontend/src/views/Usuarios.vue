<script setup lang="js">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Title from '../components/Title.vue'
import ModalForm from '../components/ModalForm.vue'
import ModalEdit from '../components/ModalEdit.vue'
import ModalDelete from '../components/ModalDelete.vue'
import MailModal from '../components/MailModal.vue'
import ExpandableListItem from '../components/ExpandableListItem.vue'
import DataDisplay from '../components/DataDisplay.vue'
import ActionButtons from '../components/ActionButtons.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import SearchInput from '../components/SearchInput.vue'
import { userSchema } from '@/formSchemas/user.schema'
import { userEditSchema } from '@/formSchemas/userEdit.schema'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()
const users = computed(() => userStore.users)
const searchQuery = ref('')
const showAddUserModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const userToDelete = ref(null)
const editError = ref('')
const editingUsers = ref(null)
const route = useRoute()
const expandedUser = ref([])
const currentPage = ref(1)
const itemsPerPage = 20

// Selección de usuarios para correo
const selectedUserEmails = ref([])
const showMailModal = ref(false)

const isAllSelected = computed(() => {
  return paginatedUsers.value.length > 0 && paginatedUsers.value.every(u => selectedUserEmails.value.includes(u.email))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const paginatedEmails = paginatedUsers.value.map(u => u.email)
    selectedUserEmails.value = selectedUserEmails.value.filter(email => !paginatedEmails.includes(email))
  } else {
    paginatedUsers.value.forEach(u => {
      if (!selectedUserEmails.value.includes(u.email)) {
        selectedUserEmails.value.push(u.email)
      }
    })
  }
}

const toggleSelectUser = (email) => {
  const index = selectedUserEmails.value.indexOf(email)
  if (index > -1) {
    selectedUserEmails.value.splice(index, 1)
  } else {
    selectedUserEmails.value.push(email)
  }
}

const openMailModal = () => {
  showMailModal.value = true
}

const sendMail = async (emailData) => {
  try {
    await userStore.sendEmail(emailData)
    showMailModal.value = false
    selectedUserEmails.value = []
    alert('Correo enviado con éxito')
  } catch (error) {
    console.error('Error al enviar correo:', error)
    alert('Error al enviar el correo. Por favor, revisa la consola.')
  }
}

const loadUsers = async () => {
  await userStore.fetchUsers()
}

onMounted(async () => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  await loadUsers()
})


const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return users.value

  return users.value.filter(user =>
    ['nombre', 'apellidos', 'dni', 'email', 'categoria', 'socio'].some(key => {
      const value = user[key]?.toString().toLowerCase()
      if (!value) return false;

      if (key === 'socio') {
        return value === query
      }
      else {
        return value.includes(query)
      }
    }
    )
  )
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

const showingRange = computed(() => {
  if (filteredUsers.value.length === 0) return '0 - 0'
  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(start + itemsPerPage - 1, filteredUsers.value.length)
  return `${start} - ${end}`
})

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(filteredUsers, (newUsers) => {
  if (searchQuery.value) {
    expandedUser.value = newUsers.map(u => u.dni)
  } else {
    expandedUser.value = []
  }
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const addUsers = () => {
  // On click open pop up where user can add a new users. we will use a new component.
  showAddUserModal.value = true
}

const saveUser = async (newUser) => {
  try {
    await userStore.addUser(newUser)
    showAddUserModal.value = false
  } catch (error) {
    console.error('Error al guardar el usuario:', error)
    const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Error al guardar el usuario'
    alert(`No se pudo guardar el usuario: ${errorMsg}`)
  }
}

const editUser = (user) => {
  editingUsers.value = user
  showEditModal.value = true
}

const saveEdit = async (payload) => {
  try {
    await userStore.updateUser(payload)
    showEditModal.value = false
    editingUsers.value = null
    editError.value = ''
  } catch (e) {
    const errMsg = e.response?.data?.message || e.response?.data?.error || e?.message || String(e) || 'No se pudo actualizar el usuario'
    editError.value = Array.isArray(errMsg) ? errMsg.join(', ') : errMsg
  }
}

const openDeleteModal = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!userToDelete.value) return
  try {
    await userStore.removeUser(userToDelete.value.dni)
  } catch (error) {
    console.error('Error al eliminar el usuario:', error)
    alert(`Error al eliminar usuario: ${error.response?.data?.message || error.message || 'Error desconocido'}`)
    return
  }
  userToDelete.value = null
  showDeleteModal.value = false
}

const toggleDetails = (dni) => {
  if (expandedUser.value.includes(dni) && expandedUser.value.length === 1) {
    expandedUser.value = []
  } else {
    expandedUser.value = [dni]
  }
}


const formatDate = (date) => date ? new Date(date).toLocaleDateString() : ''
</script>

<template>
  <main>
    <Title title="Usuarios" icon="people" />

    <div class="showUsers">
      <div class="showUsers-header">
        <h2>Lista de Usuarios</h2>
        <div class="options">
          <div class="pagination-controls" v-if="filteredUsers.length > 0">
            <span>{{ showingRange }} de {{ filteredUsers.length }}</span>
            <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <PrimaryButton @click="addUsers">Agregar Usuario</PrimaryButton>
          <transition name="fade-scale" v-if="showAddUserModal">
            <ModalForm title="Agregar Usuario" :schema="userSchema" @submit="saveUser" v-if="showAddUserModal" @close="showAddUserModal = false"/>
          </transition>
          <ModalEdit title="Editar Usuario" :schema="userEditSchema" :initial="editingUsers" :error="editError" @submit="saveEdit" v-if="showEditModal" @close="() => { showEditModal = false; editingUsers = null; editError = '' }"/>
          <ModalDelete :title="'Eliminar Usuario'" :message="'¿Está seguro de que desea eliminar este Usuario? Esta acción no se puede deshacer.'" :itemName="userToDelete?.name" @confirm="confirmDelete" @close="() => { showDeleteModal = false; userToDelete = null }" v-if="showDeleteModal"/>
          <PrimaryButton @click="openMailModal" :disabled="selectedUserEmails.length === 0" variant="secondary">
            Enviar Correo ({{ selectedUserEmails.length }})
          </PrimaryButton>
          <PrimaryButton @click="() => { selectedUserEmails = []; openMailModal() }" variant="outline">
            Correo a Todos
          </PrimaryButton>
          <MailModal 
            v-if="showMailModal" 
            :recipients="selectedUserEmails" 
            @close="showMailModal = false" 
            @send="sendMail"
          />
          <SearchInput placeholder="Buscar usuario..." v-model="searchQuery"/>
        </div>
      </div>

      <div class="users-list-header" v-if="paginatedUsers.length > 0">
        <div class="selection-control">
          <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" id="selectAll" />
          <label for="selectAll">Seleccionar todos en esta página</label>
        </div>
      </div>

      <div class="users-list">
        <ExpandableListItem
          v-for="user in paginatedUsers"
          :key="user.dni"
          :expanded="expandedUser.includes(user.dni)"
          @toggle="toggleDetails(user.dni)"
        >
          <template #summary-left>
            <div class="user-summary-selection" @click.stop>
              <input 
                type="checkbox" 
                :checked="selectedUserEmails.includes(user.email)" 
                @change="toggleSelectUser(user.email)"
              />
            </div>
            <span class="user-name">{{ user.nombre }} {{ user.apellidos }}</span>
          </template>
          <template #summary-right>
            <span class="role">{{ user.categoria }}</span>
          </template>
          <template #details>
            <div class="card-body between">
              <DataDisplay
                :items="[
                  { label: 'DNI', value: user.dni },
                  { label: 'Email', value: user.email },
                  { label: 'Tel', value: user.telefono },
                  { label: 'Dirección', value: `${user.direccion || '-'}, ${user.CP || '-'}` },
                  { label: 'Localidad', value: `${user.localidad || '-'}, ${user.provincia || '-'}, ${user.pais || '-'}` },
                  { label: 'Fecha Alta', value: formatDate(user.fechadealta) },
                  { label: 'Fecha Baja', value: formatDate(user.fechadebaja) },
                  { label: 'Forma Pago', value: `${user.formadepago || '-'} | Cuota: ${user.cuota || '-'}` }
                ]"
              />
              <ActionButtons
                showEdit
                showDelete
                @edit="editUser(user)"
                @delete="openDeleteModal(user)"
              />
            </div>
          </template>
        </ExpandableListItem>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px 40px;
  min-height: 100vh;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}

@media (max-width: 768px) {
  main {
    padding: 20px 15px;
  }
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.user-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.role {
  background-color: #e1e8ff;
  color: #2a4ea2;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 10px;
  border-radius: 6px;
}

.options {
  display: flex;
  align-items: center;
  gap: 15px;
}

@media (max-width: 768px) {
  .showUsers-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  .options {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
}

/* Los botones primarios ahora usan el componente PrimaryButton */

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: var(--text-secondary);
  background: var(--card-bg);
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

@media (max-width: 480px) {
  .pagination-controls {
    justify-content: space-between;
    width: 100%;
  }
}

.options button.page-btn {
  padding: 5px;
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.options button.page-btn:hover {
  background-color: var(--button-secondary-hover);
}

.options button.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.between {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.box-item {
  background: var(--bg-primary);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-top: 10px;
}

:global(.dark) .role {
  background-color: rgba(37, 99, 235, 0.2);
  color: #60a5fa;
}
.user-summary-selection {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.user-summary-selection input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.users-list-header {
  margin-top: 20px;
  padding: 10px 24px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.selection-control {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 600;
}

.selection-control input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
