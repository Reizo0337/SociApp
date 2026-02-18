<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useNotificationStore } from '../stores/notification'

const props = defineProps<{
  schema: any[]
  title?: string
  initial?: Record<string, any>
  error?: string
}>()
const emit = defineEmits(['submit', 'close'])
const notificationStore = useNotificationStore()



const model = reactive<Record<string, any>>({})
const resolvedOptions = reactive<Record<string, any[]>>({})

// Inicializar model basado en el schema
console.log(Array.isArray(props.schema), props.schema)
props.schema.forEach((section: any) => {
  section.fields.forEach((field: any) => {
    if (field.type === 'select' && field.multiple) {
      model[field.key] = props.initial?.[field.key] || []
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
      const value = model[field.key]

      if (!field.required) return false

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
  
  const payload = { ...model };
  // Asegurar tipos
  if (payload.dni) payload.dni = String(payload.dni);
  if (payload.id) delete payload.id;

  emit('submit', payload)
}

// Fecha actual
const setToday = (key: string) => {
  const today = new Date()
  model[key] = today.toISOString().split('T')[0]
}

const toggleCheckbox = (key: string, value: any) => {
  const arr = model[key]
  const index = arr.indexOf(value)

  if (index > -1) {
    arr.splice(index, 1)
  } else {
    arr.push(value)
  }
}


</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <!-- HEADER -->
      <div class="modal-header">
        <h2>{{ title || 'Agregar' }}</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="submit">
        <div v-if="props.error" class="form-error">{{ props.error }}</div>
        <!-- FILA SUPERIOR: Dos columnas -->
        <div class="grid-2">
          <!-- Columna izquierda: Datos personales -->
          <section class="card" v-for="value in schema">
            <h3>{{ value.section }}</h3>
            <div
              v-for="field in value.fields"
              :key="value.section"
              class="form-group"
            >
              <label>{{ field.label }}</label>
              <input
                v-if="field.type !== 'select' && field.type !== 'date' && field.type !== 'file'"
                :type="field.type"
                v-model="model[field.key]"
                :required="field.required"
              />
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
              <!-- SELECT MÚLTIPLE (checkboxes) -->
              <div v-else-if="field.type === 'select' && field.multiple">
                <div
                  v-for="opt in resolvedOptions[field.key] ||
                  (Array.isArray(field.options) ? field.options : [])"
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
              </div>




              <!-- SELECT SIMPLE -->
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

        <!-- BOTÓN SUBMIT -->
        <div class="actions">
          <button type="submit">GUARDAR</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/modals.css';
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #2c2c2c;
  background: #1e1e1e;
}

.checkbox-option:hover {
  background: #2a2a2a;
  border-color: #3a3a3a;
}

.checkbox-option input[type="checkbox"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #555;
  display: grid;
  place-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-option input[type="checkbox"]::before {
  content: "";
  width: 10px;
  height: 10px;
  transform: scale(0);
  transition: transform 0.15s ease-in-out;
  background-color: #4ade80; /* verde bonito */
  border-radius: 2px;
}

.checkbox-option input[type="checkbox"]:checked {
  border-color: #4ade80;
  background-color: #4ade80;
}

.checkbox-option input[type="checkbox"]:checked::before {
  transform: scale(1);
  background: white;
}

.checkbox-option label {
  cursor: pointer;
  flex: 1;
  color: #e5e5e5;
  font-size: 14px;
}

</style>
