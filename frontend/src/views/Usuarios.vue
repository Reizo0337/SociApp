<script setup lang="js">
import { ref, onMounted, computed } from 'vue'

const users = ref([])
const searchQuery = ref('')

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/users')
    if (response.ok) {
      const data = await response.json()
      users.value = data.users || []
    }
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
})

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(user =>
    Object.values(user).some(val =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
})

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : ''
</script>

<template>
  <main>
    <div class="title">
      <span class="material-symbols-outlined">people</span>
      <h1>Usuarios</h1>
    </div>

    <div class="showUsers">
      <div class="showUsers-header">
        <h2>Lista de Usuarios</h2>
        <input type="text" placeholder="Buscar usuario..." v-model="searchQuery" />
      </div>

      <div class="users-grid">
        <div v-for="user in filteredUsers" :key="user.dni" class="user-card">
          <div class="card-header">
            <h3>{{ user.name }} {{ user.surname }}</h3>
            <span class="role">{{ user.role }}</span>
          </div>
          <div class="card-body">
            <p><strong>DNI:</strong> {{ user.dni }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Tel:</strong> {{ user.phone || '-' }}</p>
            <p><strong>Dirección:</strong> {{ user.address || '-' }}, {{ user.postalCode || '-' }}</p>
            <p><strong>Localidad:</strong> {{ user.locality || '-' }}, {{ user.province || '-' }}, {{ user.country || '-' }}</p>
            <p><strong>Fecha Alta:</strong> {{ formatDate(user.registrationDate) }}</p>
            <p><strong>Fecha Baja:</strong> {{ formatDate(user.deregistrationDate) || '-' }}</p>
            <p><strong>Forma Pago:</strong> {{ user.paymentMethod || '-' }} | <strong>Cuota:</strong> {{ user.fee || '-' }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px 40px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f6fa;
  min-height: 100vh;
}

.title {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.title h1 {
  margin-left: 10px;
  font-size: 28px;
  color: #2a4ea2;
}

.title span {
  font-size: 40px;
  color: #2a4ea2;
}

.showUsers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.showUsers-header h2 {
  font-size: 22px;
  color: #333;
}

.showUsers-header input {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 220px;
  font-size: 14px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.user-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #2a4ea2;
}

.role {
  background-color: #e1e8ff;
  color: #2a4ea2;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 6px;
}

.card-body p {
  margin: 5px 0;
  font-size: 13px;
  color: #555;
}

.card-body strong {
  color: #333;
}
</style>
