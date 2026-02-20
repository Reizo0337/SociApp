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
import { useNotificationStore } from '@/stores/notification'

const userStore = useUserStore()
const notificationStore = useNotificationStore()
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
const itemsPerPage = 10

// Selección de usuarios para correo
const selectedUserEmails = ref([])
const showMailModal = ref(false)

const openMailModal = () => {
  showMailModal.value = true
}

const sendMail = async (emailData) => {
  try {
    await userStore.sendEmail(emailData)
    showMailModal.value = false
    selectedUserEmails.value = []
    notificationStore.success('Correo enviado con éxito')
  } catch (error) {
    console.error('Error al enviar correo:', error)
    notificationStore.error('Error al enviar el correo. Por favor, revisa la consola.')
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
    expandedUser.value = [...newUsers]
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
    notificationStore.success('Usuario guardado con éxito')
  } catch (error) {
    console.error('Error al guardar el usuario:', error)
    const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Error al guardar el usuario'
    notificationStore.error(`No se pudo guardar el usuario: ${errorMsg}`)
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
    notificationStore.success('Usuario actualizado con éxito')
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
    notificationStore.success('Usuario eliminado con éxito')
  } catch (error) {
    console.error('Error al eliminar el usuario:', error)
    notificationStore.error(`Error al eliminar usuario: ${error.response?.data?.message || error.message || 'Error desconocido'}`)
    return
  }
  userToDelete.value = null
  showDeleteModal.value = false
}

const toggleDetails = (user) => {
  if (expandedUser.value.includes(user) && expandedUser.value.length === 1) {
    expandedUser.value = []
  } else {
    expandedUser.value = [user]
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
          <MailModal 
            v-if="showMailModal" 
            :initialRecipients="selectedUserEmails" 
            @close="showMailModal = false" 
            @send="sendMail"
          />
          <SearchInput placeholder="Buscar usuario..." v-model="searchQuery"/>
        </div>
      </div>

      <div class="users-list">
        <ExpandableListItem
          v-for="user in paginatedUsers"
          :key="user.dni"
          :expanded="expandedUser.includes(user)"
          @toggle="toggleDetails(user)"
        >
          <template #summary-left>
            <div class="user-info-summary">
              <span class="user-name">{{ user.nombre }} {{ user.apellidos }}</span>
              <button class="individual-mail-btn" @click.stop="() => { selectedUserEmails = [user.email]; openMailModal() }" title="Enviar correo">
                <span class="material-symbols-outlined">mail</span>
              </button>
            </div>
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
                  { label: 'Población', value: `${user.poblacion || '-'}, ${user.provincia || '-'}, ${user.pais || '-'}` },
                  { label: 'Fecha Alta', value: formatDate(user.fechaalta) },
                  { label: 'Fecha Baja', value: formatDate(user.fechabaja) },
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

@media (max-width: 480px) {
  .user-name {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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

.user-info-summary {
  display: flex;
  align-items: center;
  gap: 10px;
}

.individual-mail-btn {
  background: transparent;
  border: none;
  color: var(--button-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
  opacity: 0.7;
}

.individual-mail-btn:hover {
  background: rgba(var(--button-primary-rgb, 37, 99, 235), 0.1);
  opacity: 1;
  transform: scale(1.1);
}

.individual-mail-btn span {
  font-size: 1.2rem;
}

</style>
