<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { useNotificationStore } from '../stores/notification'
import type { ActivityFormData } from '@/formSchemas/Activity.schema'

const props = defineProps<{
  schema: any[]
  title?: string
  initial?: Record<string, any>
  error?: string
  loading?: boolean
}>()
const emit = defineEmits(['submit', 'close'])
const notificationStore = useNotificationStore()
const isBackdropClick = ref(false)

const model = reactive<Record<string, any>>({})
const resolvedOptions = reactive<Record<string, any[]>>({})

// Inicializar model basado en el schema
props.schema.forEach((section: any) => {
  section.fields.forEach((field: any) => {
    if (field.type === 'select' && field.multiple) {
      model[field.key] = props.initial?.[field.key] || []
    } else if (field.type === 'checkbox') {
      model[field.key] = props.initial?.[field.key] ?? false
    } else {
      model[field.key] = props.initial?.[field.key] || ''
    }
  })
})

const handleFileChange = (event: Event, key: string) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    model[key] = target.files[0]
  }
}

// Toggle para selects múltiples renderizados como checkboxes
const toggleCheckbox = (key: string, value: any) => {
  const arr = model[key]
  const index = arr.indexOf(value)
  if (index > -1) {
    arr.splice(index, 1)
  } else {
    arr.push(value)
  }
}

onMounted(async () => {
  for (const section of props.schema) {
    for (const field of section.fields) {
      if (field.type === 'select' && typeof field.options === 'function') {
        try {
          resolvedOptions[field.key] = await field.options()
        } catch (error) {
          console.error(`Error cargando opciones para ${field.key}:`, error)
        }
      }
    }
  }
})

// Función submit
const submit = () => {
  const missingFields = props.schema.flatMap((section: any) =>
    section.fields.filter((field: any) => {
      const isVisible = !field.showIf || field.showIf(model as ActivityFormData)
      if (!isVisible || !field.required) return false
      const value = model[field.key]
      if (field.type === 'select' && field.multiple) {
        return !Array.isArray(value) || value.length === 0
      }
      return !value
    }),
  )

  if (missingFields.length > 0) {
    notificationStore.warning('Por favor, complete todos los campos obligatorios.')
    return
  }

  const payload: Record<string, any> = {}

  props.schema.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      const isVisible = !field.showIf || field.showIf(model as ActivityFormData)
      if (!isVisible) return
      // Campos solo UI, no se envían al backend
      if (field.key === 'asociarProyecto') return

      let value = model[field.key]
      if (value === '' && !field.required) value = null
      payload[field.key] = value
    })
  })

  if (payload.id) delete payload.id

  emit('submit', payload)
}

const setToday = (key: string) => {
  const today = new Date()
  model[key] = today.toISOString().split('T')[0]
}
</script>

<template>
  <div
    class="modal"
    @mousedown.self="isBackdropClick = true"
    @mouseup.self="isBackdropClick && $emit('close'); isBackdropClick = false"
    @mouseup="isBackdropClick = false"
  >
    <div class="modal-content">
      <!-- HEADER -->
      <div class="modal-header">
        <h2>{{ title || 'Actividad' }}</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="submit">
        <div v-if="props.error" class="form-error">{{ props.error }}</div>

        <div class="grid-2">
          <section class="card" v-for="value in schema" :key="value.section">
            <h3>{{ value.section }}</h3>
            <template v-for="field in value.fields" :key="field.key">
              <div
                v-if="!field.showIf || field.showIf(model)"
                class="form-group"
              >
                <label v-if="field.type !== 'checkbox'">{{ field.label }}</label>

                <!-- CHECKBOX SIMPLE (toggle UI) -->
                <div
                  v-if="field.type === 'checkbox'"
                  class="checkbox-option"
                  @click="model[field.key] = !model[field.key]"
                >
                  <input
                    type="checkbox"
                    v-model="model[field.key]"
                    :id="field.key"
                    @click.stop
                  />
                  <span>{{ field.label }}</span>
                </div>

                <!-- INPUT text/number/etc -->
                <input
                  v-else-if="field.type !== 'select' && field.type !== 'date' && field.type !== 'file'"
                  :type="field.type"
                  v-model="model[field.key]"
                  :required="field.required"
                />

                <!-- FILE -->
                <div v-else-if="field.type === 'file'" class="file-upload-wrapper">
                  <input
                    type="file"
                    class="file-input-custom"
                    @change="handleFileChange($event, field.key)"
                    :accept="field.accept"
                    :required="field.required"
                  />
                  <div class="file-upload-btn">
                    <span class="material-symbols-outlined">cloud_upload</span>
                    <span>{{ field.label }}</span>
                  </div>
                  <div v-if="model[field.key]" class="file-selected-name">
                    <span class="material-symbols-outlined">check_circle</span>
                    {{ (model[field.key] as any).name || 'Archivo seleccionado' }}
                  </div>
                </div>

                <!-- SELECT MÚLTIPLE → checkboxes individuales (mismo patrón que ModalForm) -->
                <div v-else-if="field.type === 'select' && field.multiple" class="multi-checkbox-list">
                  <div
                    v-for="opt in resolvedOptions[field.key] || (Array.isArray(field.options) ? field.options : [])"
                    :key="opt.value || opt"
                    class="checkbox-option"
                    @click="toggleCheckbox(field.key, opt.value || opt)"
                  >
                    <input
                      type="checkbox"
                      :value="opt.value || opt"
                      v-model="model[field.key]"
                      @click.stop
                    />
                    <span>{{ opt.label || opt }}</span>
                  </div>
                  <p v-if="(resolvedOptions[field.key] || []).length === 0" class="no-options">
                    Cargando proyectos...
                  </p>
                </div>

                <!-- SELECT SIMPLE -->
                <select
                  v-else-if="field.type === 'select'"
                  v-model="model[field.key]"
                  :required="field.required"
                >
                  <option disabled value="">-- Selecciona una opción --</option>
                  <option
                    v-for="opt in resolvedOptions[field.key] || (Array.isArray(field.options) ? field.options : [])"
                    :key="opt.value || opt"
                    :value="opt.value || opt"
                  >
                    {{ opt.label || opt }}
                  </option>
                </select>

                <!-- DATE -->
                <div v-else-if="field.type === 'date'" class="inline">
                  <input
                    type="date"
                    v-model="model[field.key]"
                    :required="field.required"
                  />
                  <button type="button" @click="setToday(field.key)">Hoy</button>
                </div>
              </div>
            </template>
          </section>
        </div>

        <div class="actions">
          <button type="submit" :disabled="loading">
            {{ loading ? 'GUARDANDO...' : 'GUARDAR' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/modals.css';

.multi-checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 220px;
  overflow-y: auto;
  padding: 4px 0;
}

.no-options {
  font-size: 13px;
  color: var(--text-secondary);
  font-style: italic;
  padding: 8px 0;
}

@keyframes bounceTick {
  0% { transform: translate(-50%, -50%) scale(0); }
  60% { transform: translate(-50%, -50%) scale(1.3); }
  100% { transform: translate(-50%, -50%) scale(1); }
}
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}

.checkbox-wrapper input[type="checkbox"] {
  appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid #6366f1;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: 0.3s ease;
}

.checkbox-wrapper input[type="checkbox"]::after {
  content: "";
  position: absolute;
  left: 8px;
  top: 0px;
  width: 6px;
  height: 14px;
  border: solid #6366f1;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg) scale(0);
  transition: 0.25s ease;
}

.checkbox-wrapper input[type="checkbox"]:checked {
  background: #6366f1;
}

.checkbox-wrapper input[type="checkbox"]:checked::after {
  border-color: white;
  transform: rotate(45deg) scale(1);
}

.checkbox-wrapper label {
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
}
</style>
