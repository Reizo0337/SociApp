<script setup lang="js">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Title from '../components/Title.vue'
import ModalForm from '../components/ModalForm.vue'
import { userSchema } from '@/formSchemas/user.schema'


const users = ref([])
const searchQuery = ref('')
const showAddUserModal = ref(false)
const route = useRoute()

const loadUsers = async () => {
  try {
    const response = await fetch('http://192.168.1.55:3000/users')

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
    ['name', 'surname', 'dni', 'email', 'role', 'socio'].some(key => {
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

const addUsers = () => {
  // On click open pop up where user can add a new users. we will use a new component.
  showAddUserModal.value = true
}

const saveUser = async (newUser) => {
  try {
    console.log('Nuevo usuario a enviar:', newUser);
    const response = await fetch('http://192.168.1.55:3000/users', {
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

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : ''
</script>

<template>
  <main>
    <Title title="Usuarios" icon="people" />

    <div class="showUsers">
      <div class="showUsers-header">
        <h2>Lista de Usuarios</h2>
        <div class="options">
          <button @click="addUsers">Agregar Usuario</button>
          <transition name="fade-scale" v-if="showAddUserModal">
            <ModalForm :schema="userSchema" @submit="saveUser" v-if="showAddUserModal" @close="showAddUserModal = false"/>
          </transition>
          <input type="text" placeholder="Buscar usuario..." v-model="searchQuery"/>
        </div>
      </div>

      <div class="users-grid">
        <div v-for="user in filteredUsers" :key="user.dni" class="user-card">
          <div class="card-header">
            <h3>{{ user.nombre }} {{ user.apellidos }}</h3>
            <div class="action-buttons">
              <button @click="editActivity(activity)"><span class="material-symbols-outlined edit">edit</span></button>
              <button @click="openDeleteModal(activity)"><span class="material-symbols-outlined delete">delete</span></button>
            </div>

            <span class="role">{{ user.categoria }}</span>
          </div>
          <div class="card-body">
            <p><strong>DNI:</strong> {{ user.dni }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Tel:</strong> {{ user.telefono || '-' }}</p>
            <p><strong>Dirección:</strong> {{ user.direccion || '-' }}, {{ user.CP || '-' }}</p>
            <p><strong>Localidad:</strong> {{ user.localidad || '-' }}, {{ user.provincia || '-' }}, {{ user.pais || '-' }}</p>
            <p><strong>Fecha Alta:</strong> {{ formatDate(user.fechadealta) }}</p>
            <p><strong>Fecha Baja:</strong> {{ formatDate(user.fechadebaja) || '-' }}</p>
            <p><strong>Forma Pago:</strong> {{ user.formadepago || '-' }} | <strong>Cuota:</strong> {{ user.cuota || '-' }}</p>
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

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.card-header {
  position: relative;
}

.card-body { margin-top: 15px;}

.role {
  color: #2a4ea2;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 6px;
  position: absolute;
  left: 0;
  top: 46px;
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
/* --- ESTILOS MODO OSCURO PARA LAS TARJETAS DE USUARIO --- */

/* Fondo de la tarjeta en modo oscuro */
:global(.dark) .user-card {
  background-color: #0a0a0a; /* Gris casi negro para resaltar sobre el fondo negro puro */
  border: 1px solid #1e293b; /* Borde azul oscuro sutil */
  color: #f8fafc;            /* Texto claro */
}

/* Título (Nombre del usuario) en modo oscuro */
:global(.dark) .card-header h3 {
  color: #ffffff;
}

/* Etiquetas de datos (Strong) */
:global(.dark) .card-body strong {
  color: #60a5fa; /* Azul claro para que los títulos resalten */
}

/* Textos secundarios dentro de la card */
:global(.dark) .card-body p {
  color: #94a3b8;
}

/* El badge del Rol/Categoría en modo oscuro */
:global(.dark) .role {
  background-color: rgba(37, 99, 235, 0.2); /* Azul translúcido */
  color: #60a5fa;                          /* Texto azul brillante */
}

/* Estilo para los botones de acción dentro de la card */
:global(.dark) .action-buttons button span {
  color: #94a3b8;
}

:global(.dark) .action-buttons button:hover span.edit {
  color: #60a5fa;
}

:global(.dark) .action-buttons button:w span.delete {
  color: #f87171;
}
</style>
