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
    model[field.key] = props.initial ? (props.initial[field.key] || '') : ''
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
    section.fields.filter((field: any) => field.required && !model[field.key]),
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
</style>
