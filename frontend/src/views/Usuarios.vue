<script setup lang="js">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Title from '../components/Title.vue'
import ModalForm from '../components/ModalForm.vue'
import ModalEdit from '../components/ModalEdit.vue'
import ModalDelete from '../components/ModalDelete.vue'
import { userSchema } from '@/formSchemas/user.schema'
import { userEditSchema } from '@/formSchemas/userEdit.schema'

const users = ref([])
const searchQuery = ref('')
const showAddUserModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const userToDelete = ref(null)
const editError = ref('')
const editingUsers = ref(null)
const route = useRoute()
const expandedUser = ref(null)
const currentPage = ref(1)
const itemsPerPage = 20

const loadUsers = async () => {
  try {
    const response = await fetch('http://localhost:3000/users')

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new Error('La respuesta no es JSON')
    }

    const data = await response.json()
    // NestJS devuelve el array directamente, ajustamos la lectura:
    users.value = Array.isArray(data) ? data : (data.users || [])
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
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
    console.log('Nuevo usuario a enviar:', newUser);
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })

    console.log('Response:', response)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al guardar el usuario')
    }

    const savedUser = await response.json()
    users.value.unshift(savedUser) // Agrega al inicio para verlo rápidamente
    showAddUserModal.value = false
  } catch (error) {
    console.error('Error al guardar el usuario:', error)
    alert(`No se pudo guardar el usuario: ${error.message}`)
  }
}

const editUser = (user) => {
  editingUsers.value = user
  showEditModal.value = true
}

const saveEdit = async (payload) => {
  try {
    // El backend espera 'poblacion', pero el frontend usa 'localidad'.
    // Hacemos el mapeo inverso antes de enviar.
    const payloadForBackend = { ...payload };
    if (payloadForBackend.localidad) {
      payloadForBackend.poblacion = payloadForBackend.localidad;
      delete payloadForBackend.localidad;
    }
    const res = await fetch(`http://localhost:3000/users/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadForBackend)
    })
    if (!res.ok) {
      let errMsg = 'No se pudo actualizar el usuario'
      try {
        const errBody = await res.json()
        if (errBody?.message) errMsg = Array.isArray(errBody.message) ? errBody.message.join(', ') : errBody.message
        else if (errBody?.error) errMsg = errBody.error
      } catch {}
      editError.value = errMsg
      return
    }
    const updatedUser = await res.json()
    const idx = users.value.findIndex(u => u.dni === updatedUser.dni)
    if (idx !== -1) {
      // El backend devuelve la entidad sin procesar. Necesitamos mapearla al modelo de la vista.
      const userForView = {
        nombre: updatedUser.nombre,
        apellidos: updatedUser.apellidos,
        dni: updatedUser.dni,
        direccion: updatedUser.direccion,
        CP: updatedUser.CP,
        provincia: updatedUser.provincia,
        localidad: updatedUser.poblacion, // Mapeo de poblacion a localidad
        pais: updatedUser.pais,
        email: updatedUser.email,
        telefono: updatedUser.telefono,
        fechadealta: updatedUser.fechadealta,
        fechadebaja: updatedUser.fechabaja,
        formadepago: updatedUser.formadepago,
        cuota: Number(updatedUser.cuota) || 0,
        categoria: updatedUser.categoria,
        socio: updatedUser.socio
      }
      users.value.splice(idx, 1, userForView)
    }
    showEditModal.value = false
    editingUsers.value = null
    editError.value = ''
  } catch (e) {
    editError.value = e?.message || String(e) || 'No se pudo actualizar el usuario'
  }
}

const openDeleteModal = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!userToDelete.value) return
  try {
    console.log('DNI a eliminar:', userToDelete.value.dni)
    const res = await fetch(`http://localhost:3000/users/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni: userToDelete.value.dni })
    })
  } catch (error) {
    console.error('Error al eliminar el usuario:', error)
  }
  // TODO: FINISH DELETE....
  const idx = users.value.findIndex(u => u.dni === userToDelete.value.dni)
  if (idx !== -1) {
    users.value.splice(idx, 1)
  }
  userToDelete.value = null
  showDeleteModal.value = false
}

const toggleDetails = (dni) => {
  if (expandedUser.value === dni) {
    expandedUser.value = null
  } else {
    expandedUser.value = dni
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
          <button @click="addUsers">Agregar Usuario</button>
          <transition name="fade-scale" v-if="showAddUserModal">
            <ModalForm :schema="userSchema" @submit="saveUser" v-if="showAddUserModal" @close="showAddUserModal = false"/>
          </transition>
          <ModalEdit :schema="userEditSchema" :initial="editingUsers" :error="editError" @submit="saveEdit" v-if="showEditModal" @close="() => { showEditModal = false; editingUsers = null; editError = '' }"/>
          <ModalDelete :title="'Eliminar Usuario'" :message="'¿Está seguro de que desea eliminar este Usuario? Esta acción no se puede deshacer.'" :itemName="userToDelete?.name" @confirm="confirmDelete" @close="() => { showDeleteModal = false; userToDelete = null }" v-if="showDeleteModal"/>
          <input type="text" placeholder="Buscar usuario..." v-model="searchQuery"/>
        </div>
      </div>

      <div class="users-list">
        <div v-for="user in paginatedUsers" :key="user.dni" class="user-list-item" @click="toggleDetails(user.dni)" :class="{ 'expanded': expandedUser === user.dni }">
          <div class="user-summary">
            <span class="user-name">{{ user.nombre }} {{ user.apellidos }}</span>
            <div class="summary-right">
              <span class="role">{{ user.categoria }}</span>
              <span class="material-symbols-outlined arrow-icon" :class="{ 'rotated': expandedUser === user.dni }">expand_more</span>
            </div>
          </div>

          <div class="user-details-card" v-if="expandedUser === user.dni" @click.stop>
            <div class="card-header">
            </div>
            <div class="card-body between">
              <div class="data">
                <p><strong>DNI:</strong> {{ user.dni }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>Tel:</strong> {{ user.telefono || '-' }}</p>
                <p><strong>Dirección:</strong> {{ user.direccion || '-' }}, {{ user.CP || '-' }}</p>
                <p><strong>Localidad:</strong> {{ user.localidad || '-' }}, {{ user.provincia || '-' }}, {{ user.pais || '-' }}</p>
                <p><strong>Fecha Alta:</strong> {{ formatDate(user.fechadealta) }}</p>
                <p><strong>Fecha Baja:</strong> {{ formatDate(user.fechadebaja) || '-' }}</p>
                <p><strong>Forma Pago:</strong> {{ user.formadepago || '-' }} | <strong>Cuota:</strong> {{ user.cuota || '-' }}</p>
              </div>
              <div class="action-buttons">
                <button @click.stop="editUser(user)"><span class="material-symbols-outlined edit">edit</span></button>
                <button @click.stop="openDeleteModal(user)"><span class="material-symbols-outlined delete">delete</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px 40px;
  min-height: 100vh;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.user-list-item {
  position: relative;
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #eee;
}

.user-list-item:hover, .user-list-item.expanded {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 10;
  border-color: #2a4ea2;
}

.card-header {
  position: relative;
  display: flex;
  justify-content: right;
  align-items: center;
  margin-bottom: 15px;
}

.user-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.user-details-card {
  border-top: 1px solid #eee;
  padding: 15px;
  margin-top: 10px;
  border-radius: 6px;
  cursor: default;
}

.role {
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

.options button {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #2a4ea2;
  color: #fff;
}

.options button:hover {
  background-color: #1b3570;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #666;
}

.options button.page-btn {
  padding: 5px;
  background-color: transparent;
  color: #333;
  border: 1px solid #ddd;
}

.options button.page-btn:hover {
  background-color: #f0f0f0;
}

.options button.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.summary-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.arrow-icon {
  transition: transform 0.3s ease;
  color: #666;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

.between {
  display: flex;
  justify-content: space-between;
}

:global(.dark) .user-list-item {
  background-color: #0a0a0a;
  border: 1px solid #1e293b;
  color: #f8fafc;
}

:global(.dark) .user-name {
  color: #f8fafc;
}

:global(.dark) .user-details-card {
  background-color: #111827;
  border-top: 1px solid #334155;
  color: #f8fafc;
}

:global(.dark) .card-header h3 {
  color: #ffffff;
}

:global(.dark) .card-body strong {
  color: #60a5fa;
}

:global(.dark) .card-body p {
  color: #94a3b8;
}

:global(.dark) .role {
  background-color: rgba(37, 99, 235, 0.2);
  color: #60a5fa;
}

.action-buttons {
  display: flex;
  justify-content: start;
  align-items: start;
}

:global(.dark) .action-buttons button span {
  color: #94a3b8;
}

:global(.dark) .action-buttons button:hover span.edit {
  color: #60a5fa;
}

:global(.dark) .action-buttons button:w span.delete {
  color: #f87171;
}

:global(.dark) .pagination-controls {
  color: #aaa;
}

:global(.dark) .options button.page-btn {
  color: #eee;
  border-color: #444;
}

:global(.dark) .options button.page-btn:hover {
  background-color: #333;
}
</style>
