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
    let defaultValue = '';
    if (field.type === 'checkbox') {
      defaultValue = field.default !== undefined ? field.default : false;
    }
    
    model[field.key] = props.initial ? (props.initial[field.key] ?? defaultValue) : defaultValue
  })
})

const handleFileChange = (event: Event, key: string) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    model[key] = target.files[0]
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
  // Validar campos requeridos
  const missingFields = props.schema.flatMap((section: any) =>
    section.fields.filter((field: any) => {
      // Solo validar si es visible
      const isVisible = !field.visibleIf || field.visibleIf(model as ActivityFormData)
      return isVisible && field.required && !model[field.key]
    }),
  )

  if (missingFields.length > 0) {
    notificationStore.warning('Por favor, complete todos los campos obligatorios.')
    return
  }
  
  // Limpiar payload para el backend
  const payload: Record<string, any> = {};
  
  props.schema.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      // Solo enviar campos visibles
      const isVisible = !field.visibleIf || field.visibleIf(model as ActivityFormData);
      if (isVisible) {
        let value = model[field.key];
        
        // Convertir strings vacíos a null para campos opcionales
        if (value === '' && !field.required) {
          value = null;
        }
        
        // No enviar campos solo para la UI
        if (field.key === 'hasProject') return;
        
        payload[field.key] = value;
      }
    });
  });

  // Asegurar tipos y limpiar campos innecesarios
  if (payload.id) delete payload.id;

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
            <div
              v-for="field in value.fields"
              :key="field.key"
              class="form-group"
              v-show="!field.visibleIf || field.visibleIf(model as ActivityFormData)"
            >
              <label v-if="field.type !== 'checkbox'">{{ field.label }}</label>
              
              <!-- Checkbox -->
              <div v-if="field.type === 'checkbox'" class="checkbox-wrapper">
                <input
                  type="checkbox"
                  v-model="model[field.key]"
                  :id="field.key"
                />
                <label :for="field.key">{{ field.label }}</label>
              </div>

              <!-- Input text/number/etc -->
              <input
                v-else-if="field.type !== 'select' && field.type !== 'date' && field.type !== 'file'"
                :type="field.type"
                v-model="model[field.key]"
                :required="field.required"
              />

              <!-- File -->
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

              <!-- Select -->
              <select
                v-else-if="field.type === 'select'"
                v-model="model[field.key]"
                :required="field.required"
              >
                <option disabled value="">-- Selecciona una opción --</option>
                <option
                  v-for="opt in resolvedOptions[field.key] ||
                  (Array.isArray(field.options) ? field.options : [])"
                  :key="opt.value || opt"
                  :value="opt.value || opt"
                >
                  {{ opt.label || opt }}
                </option>
              </select>

              <!-- Date -->
              <div v-else-if="field.type === 'date'" class="inline">
                <input
                  type="date"
                  v-model="model[field.key]"
                  :required="field.required"
                />
                <button type="button" @click="setToday(field.key)">Hoy</button>
              </div>
            </div>
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

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}

.checkbox-wrapper input[type="checkbox"] {
  width: auto;
  margin: 0;
  cursor: pointer;
}

.checkbox-wrapper label {
  margin: 0;
  cursor: pointer;
  font-weight: normal;
}
</style>
