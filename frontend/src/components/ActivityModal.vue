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
    let defaultValue: any = '';
    if (field.type === 'checkbox') {
      defaultValue = field.default !== undefined ? field.default : false;
    } else if (field.multiple) {
      defaultValue = [];
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
        if (field.key === 'hasProject' || field.key === 'asociarProyecto') return;
        
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

              <!-- Select (simple o múltiple) -->
              <select
                v-else-if="field.type === 'select'"
                v-model="model[field.key]"
                :required="field.required && !field.multiple"
                :multiple="field.multiple || false"
                :class="{ 'select-multiple': field.multiple }"
              >
                <option v-if="!field.multiple" disabled value="">-- Selecciona una opción --</option>
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

.select-multiple {
  width: 90%;
  min-height: 130px;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.select-multiple option {
  padding: 8px 10px;
  border-radius: 4px;
  margin: 1px 0;
  cursor: pointer;
  transition: background 0.15s;
}

.select-multiple option:checked,
.select-multiple option:hover {
  background-color: var(--button-primary);
  color: white;
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
