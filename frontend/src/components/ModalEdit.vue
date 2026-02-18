<script lang="ts" setup>
import { reactive, watch, onMounted } from 'vue'
import { useNotificationStore } from '../stores/notification'

const props = defineProps<{
  schema: any[]
  initial?: Record<string, any>
  error?: string
  title?: string
}>()
const emit = defineEmits(['submit', 'close'])
const notificationStore = useNotificationStore()

const model = reactive<Record<string, any>>({})
const resolvedOptions = reactive<Record<string, any[]>>({})

const toggleCheckbox = (key: string, value: any) => {
  const arr = model[key]
  const index = arr.indexOf(value)

  if (index > -1) {
    arr.splice(index, 1)
  } else {
    arr.push(value)
  }
}

// Inicializar model con valores iniciales (si hay)
props.schema.forEach((section: any) => {
  section.fields.forEach((field: any) => {
    let value =
      props.initial && props.initial[field.key] != null
        ? props.initial[field.key]
        : ''
    // Si el campo es de tipo fecha y tiene un valor, lo formateamos a YYYY-MM-DD
    if (field.type === 'date' && value) {
      value = new Date(value).toISOString().split('T')[0]
    }
    // Si es select y viene con formato HH:mm:ss, recortamos a HH:mm
    if (
      field.type === 'select' &&
      typeof value === 'string' &&
      /^\d{2}:\d{2}:\d{2}$/.test(value)
    ) {
      value = value.substring(0, 5)
    }

    if (field.type === 'checkbox') {
      model[field.key] = !!value
    } else if (field.type === 'select' && field.multiple) {
      model[field.key] = Array.isArray(value) ? value : []
    } else {
      model[field.key] = value ?? ''
    }
  })
})

watch(
  () => props.initial,
  next => {
    if (!next) return
    props.schema.forEach((section: any) => {
      section.fields.forEach((field: any) => {
        let value = next[field.key] ?? ''
        if (field.type === 'date' && value) {
          value = new Date(value).toISOString().split('T')[0]
        }
        // Si es select y viene con formato HH:mm:ss, recortamos a HH:mm
        if (
          field.type === 'select' &&
          typeof value === 'string' &&
          /^\d{2}:\d{2}:\d{2}$/.test(value)
        ) {
          value = value.substring(0, 5)
        }

        if (field.type === 'checkbox') {
          model[field.key] = !!value
        } else if (field.type === 'select' && field.multiple) {
          model[field.key] = Array.isArray(value) ? value : []
        } else {
          model[field.key] = value ?? ''
        }
      })
    })
  },
  { immediate: true },
)

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

const handleFileChange = (event: Event, key: string, multiple: boolean) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    model[key] = multiple ? Array.from(target.files) : target.files[0]
  }
}

const submit = () => {
  // Validar campos requeridos antes de enviar
  const missingFields = props.schema.flatMap((section: any) =>
    section.fields.filter((field: any) => field.required && !model[field.key]),
  )

  if (missingFields.length > 0) {
    notificationStore.warning('Por favor, complete todos los campos obligatorios.')
    return
  }

  // Incluir idProyecto si existe en initial para otros tipos de datos que lo usen
  // Pero NO incluir 'id' para usuarios, ya que el DTO de NestJS no lo permite (usa dni)
  const payload: any = {
    ...(props.initial?.idProyecto ? { idProyecto: props.initial.idProyecto } : {}),
    ...model,
  }
  
  // Asegurar que propiedades críticas tengan el tipo correcto
  if (payload.dni) payload.dni = String(payload.dni);

  emit('submit', payload)
}
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ props.title || 'Editar Registro' }}</h2>
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

                <input
                  v-if="field.type !== 'select' && field.type !== 'date' && field.type !== 'file' && field.type !== 'checkbox'"
                  :type="field.type"
                  v-model="model[field.key]"
                  :required="field.required"
                />

                <!-- SINGLE CHECKBOX -->
                <div 
                  v-else-if="field.type === 'checkbox'" 
                  class="checkbox-option"
                  @click="model[field.key] = !model[field.key]"
                >
                  <input
                    type="checkbox"
                    v-model="model[field.key]"
                    @click.stop
                  />
                  <span>{{ field.label }}</span>
                </div>

              <div v-else-if="field.type === 'file'" class="file-upload-wrapper">
                  <input
                  type="file"
                  class="file-input-custom"
                  @change="handleFileChange($event, field.key, field.multiple || false)"
                  :accept="field.accept"
                  :required="field.required"
                  :multiple="field.multiple"
                />
                <div class="file-upload-btn">
                  <span class="material-symbols-outlined">cloud_upload</span>
                  <span>{{ field.label }}</span>
                </div>
                <div v-if="model[field.key]" class="file-selected-name">
                  <span class="material-symbols-outlined">check_circle</span>
                  <span v-if="Array.isArray(model[field.key])">
                    {{ model[field.key].length }} archivos seleccionados
                  </span>
                  <span v-else>
                    {{ (model[field.key] as any).name || 'Archivo seleccionado' }}
                  </span>
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
                <button
                  type="button"
                  @click="
                    () => {
                      const today = new Date()
                      model[field.key] = today.toISOString().split('T')[0]
                    }
                  "
                >
                  Hoy
                </button>
              </div>
              </div>
            </template>
          </section>
        </div>

        <div class="actions">
          <button type="button" class="secondary" @click="$emit('close')">
            CANCELAR
          </button>
          <button type="submit">GUARDAR CAMBIOS</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/modals.css';
</style>