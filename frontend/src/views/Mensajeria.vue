<script setup lang="js">
import { ref, onMounted } from 'vue'
import Title from '../components/Title.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import { useUserStore } from '@/stores/users'
import { useNotificationStore } from '@/stores/notification'

const userStore = useUserStore()
const notificationStore = useNotificationStore()
const subject = ref('')
const message = ref('')
const isSending = ref(false)
const textareaRef = ref(null)

const applyStyle = (tag) => {
  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = message.value
  
  if (tag === 'link') {
    const url = prompt('Introduce la URL:')
    if (url) {
      const selected = text.substring(start, end)
      message.value = text.substring(0, start) + `<a href="${url}">${selected || url}</a>` + text.substring(end)
    }
    return
  }

  const openTag = `<${tag}>`
  const closeTag = `</${tag}>`
  const selected = text.substring(start, end)
  
  message.value = text.substring(0, start) + openTag + selected + closeTag + text.substring(end)
}

const sendGlobalMail = async () => {
  if (!subject.value || !message.value) return
  
  if (!confirm('¿Estás seguro de que deseas enviar este correo a TODOS los socios registrados?')) return

  isSending.value = true
  try {
    await userStore.sendEmail({
      subject: subject.value,
      message: message.value,
      recipients: [] // Backend handles "all socios" when recipients is empty
    })
    notificationStore.success('Correo enviado con éxito a todos los socios.')
    subject.value = ''
    message.value = ''
  } catch (error) {
    console.error('Error sending global mail:', error)
    notificationStore.error('Error al enviar el correo masivo.')
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <main>
    <Title title="Mensajería Global" icon="mail_lock" />

    <div class="mensajeria-container card box-item">
      <div class="header-info">
        <h3>Enviar Comunicación a Todos los Socios</h3>
        <p>Este mensaje será enviado a todos los usuarios con estado "Socio".</p>
      </div>

      <div class="mail-form">
        <div class="form-group">
          <label>Asunto del Correo</label>
          <input 
            type="text" 
            v-model="subject" 
            placeholder="Ej: Convocatoria Asamblea General 2026" 
            class="subject-input"
          />
        </div>

        <div class="form-group">
          <div class="editor-toolbar">
            <button @click="applyStyle('b')" title="Negrita">
              <span class="material-symbols-outlined">format_bold</span>
            </button>
            <button @click="applyStyle('i')" title="Cursiva">
              <span class="material-symbols-outlined">format_italic</span>
            </button>
            <button @click="applyStyle('link')" title="Insertar enlace">
              <span class="material-symbols-outlined">link</span>
            </button>
            <div class="toolbar-spacer"></div>
            <span class="editor-hint">Puedes usar etiquetas HTML si lo prefieres</span>
          </div>
          
          <textarea 
            ref="textareaRef"
            v-model="message" 
            placeholder="Escribe el cuerpo del correo..." 
            class="editor-textarea"
          ></textarea>
        </div>

        <div class="preview-section" v-if="message">
          <label>Vista previa rápida</label>
          <div class="preview-content" v-html="message"></div>
        </div>

        <div class="mensajeria-actions">
          <PrimaryButton 
            @click="sendGlobalMail" 
            :disabled="isSending || !subject || !message"
            class="send-btn"
          >
            <span class="material-symbols-outlined">send</span>
            {{ isSending ? 'Enviando a todos...' : 'Enviar a todos los Socios' }}
          </PrimaryButton>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px 40px;
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.mensajeria-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 30px;
}

.header-info {
  margin-bottom: 25px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 15px;
}

.header-info h3 {
  color: var(--button-primary);
  margin-bottom: 5px;
}

.header-info p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.mail-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.subject-input {
  font-size: 1.1rem;
  font-weight: 600;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}

.editor-toolbar button {
  background: transparent;
  border: 1px solid transparent;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.editor-toolbar button:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
  color: var(--button-primary);
}

.toolbar-spacer {
  flex: 1;
}

.editor-hint {
  font-size: 11px;
  color: var(--text-tertiary);
  font-style: italic;
}

.editor-textarea {
  width: 100%;
  min-height: 300px;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 0 0 8px 8px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
}

.editor-textarea:focus {
  outline: none;
  border-color: var(--button-primary);
}

.preview-section {
  margin-top: 10px;
}

.preview-section label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.preview-content {
  padding: 15px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #333;
  min-height: 100px;
  line-height: 1.6;
}

:global(.dark) .preview-content {
  background: #1a1a1a;
  border-color: #333;
  color: #eee;
}

.mensajeria-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.send-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 30px;
}

.box-item {
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 15px var(--card-shadow);
}
</style>
