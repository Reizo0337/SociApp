<script setup lang="js">
import { ref, computed, onMounted } from 'vue'
import PrimaryButton from './PrimaryButton.vue'
import { useUserStore } from '@/stores/users'

const props = defineProps({
  title: { type: String, default: 'Enviar Correo' },
  initialRecipients: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'send'])
const userStore = useUserStore()

const recipients = ref([...props.initialRecipients])
const subject = ref('')
const message = ref('')
const isSending = ref(false)
const searchQuery = ref('')
const showUserList = ref(false)

onMounted(async () => {
  if (userStore.users.length === 0) {
    await userStore.fetchUsers()
  }
})

const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return []
  return userStore.users.filter(user => 
    (user.nombre.toLowerCase().includes(query) || 
     user.apellidos.toLowerCase().includes(query) || 
     user.email.toLowerCase().includes(query)) &&
    !recipients.value.includes(user.email)
  ).slice(0, 5)
})

const addRecipient = (email) => {
  if (!recipients.value.includes(email)) {
    recipients.value.push(email)
  }
  searchQuery.value = ''
}

const removeRecipient = (email) => {
  recipients.value = recipients.value.filter(e => e !== email)
}

const handleSend = async () => {
  if (!subject.value || !message.value) return
  
  isSending.value = true
  try {
    await emit('send', {
      subject: subject.value,
      message: message.value,
      recipients: recipients.value
    })
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content mail-modal">
      <button class="close-button" @click="$emit('close')">&times;</button>
      
      <div class="modal-header">
        <h2>{{ title }}</h2>
      </div>

      <div class="mail-form-container">
        <!-- Destinatarios -->
        <div class="form-group">
          <label>Destinatarios</label>
          <div class="recipients-tags">
            <div v-for="email in recipients" :key="email" class="recipient-tag">
              {{ email }}
              <span class="material-symbols-outlined remove-icon" @click="removeRecipient(email)">close</span>
            </div>
            <div v-if="recipients.length === 0" class="no-recipients">
              Selecciona destinatarios o deja vacío para todos los socios
            </div>
          </div>
          
          <div class="recipient-search-wrapper">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Buscar socio por nombre o email..."
              @focus="showUserList = true"
            />
            <div v-if="filteredUsers.length > 0" class="search-results">
              <div 
                v-for="user in filteredUsers" 
                :key="user.dni" 
                class="search-item"
                @click="addRecipient(user.email)"
              >
                <div class="search-item-info">
                  <span class="search-name">{{ user.nombre }} {{ user.apellidos }}</span>
                  <span class="search-email">{{ user.email }}</span>
                </div>
                <span class="material-symbols-outlined">add</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Asunto</label>
          <input type="text" v-model="subject" placeholder="Asunto del mensaje..." required />
        </div>

        <div class="form-group">
          <label>Mensaje</label>
          <textarea v-model="message" rows="8" placeholder="Escribe tu mensaje aquí..." required></textarea>
        </div>
      </div>

      <div class="actions">
        <button class="secondary" @click="$emit('close')">Cancelar</button>
        <PrimaryButton @click="handleSend" :disabled="isSending || !subject || !message">
          {{ isSending ? 'Enviando...' : 'Enviar Correo' }}
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/modals.css';

.mail-modal {
  max-width: 700px;
}

.mail-form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recipients-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  background: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  min-height: 45px;
  margin-bottom: 8px;
}

.recipient-tag {
  background: var(--button-primary);
  color: white;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.remove-icon {
  font-size: 14px;
  cursor: pointer;
}

.no-recipients {
  color: var(--text-tertiary);
  font-size: 13px;
  font-style: italic;
  display: flex;
  align-items: center;
}

.recipient-search-wrapper {
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-top: 5px;
  z-index: 100;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  max-height: 200px;
  overflow-y: auto;
}

.search-item {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}

.search-item:hover {
  background: var(--bg-tertiary);
}

.search-item-info {
  display: flex;
  flex-direction: column;
}

.search-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.search-email {
  font-size: 12px;
  color: var(--text-secondary);
}

.search-item span.material-symbols-outlined {
  color: var(--button-primary);
  font-size: 1.2rem;
}

textarea {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: var(--button-primary);
}
</style>
