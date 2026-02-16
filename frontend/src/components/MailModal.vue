<script setup lang="js">
import { ref } from 'vue'
import PrimaryButton from './PrimaryButton.vue'

const props = defineProps({
  title: { type: String, default: 'Enviar Correo' },
  recipients: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'send'])

const subject = ref('')
const message = ref('')
const isSending = ref(false)

const handleSend = async () => {
  if (!subject.value || !message.value) return
  
  isSending.value = true
  try {
    await emit('send', {
      subject: subject.value,
      message: message.value,
      recipients: props.recipients
    })
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">&times;</button>
      
      <div class="modal-header">
        <h2>{{ title }}</h2>
      </div>

      <div class="recipients-info" v-if="recipients.length > 0">
        <span class="label">Para:</span>
        <span class="value">{{ recipients.length === 1 ? recipients[0] : `${recipients.length} destinatarios seleccionados` }}</span>
      </div>
      <div class="recipients-info" v-else>
        <span class="label">Para:</span>
        <span class="value">Todos los socios</span>
      </div>

      <div class="form-group">
        <label>Asunto</label>
        <input type="text" v-model="subject" placeholder="Escribe el asunto del correo..." required />
      </div>

      <div class="form-group">
        <label>Mensaje</label>
        <textarea v-model="message" rows="10" placeholder="Escribe tu mensaje aquí..." required></textarea>
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

.recipients-info {
  margin-bottom: 20px;
  padding: 10px;
  background: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.recipients-info .label {
  font-weight: 700;
  color: var(--text-secondary);
}

.recipients-info .value {
  color: var(--button-primary);
  font-weight: 600;
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
  min-height: 150px;
}

textarea:focus {
  outline: none;
  border-color: var(--button-primary);
}
</style>
