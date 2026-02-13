<script lang="ts" setup>
import { reactive, onMounted } from 'vue'

const props = defineProps<{
  schema: any[]
  title?: string
  initial?: Record<string, any>
  error?: string
}>()
const emit = defineEmits(['submit', 'close'])

const model = reactive({})
const resolvedOptions = reactive<Record<string, any[]>>({})

// Inicializar model basado en el schema
console.log(Array.isArray(props.schema), props.schema)
props.schema.forEach(section => {
  section.fields.forEach(field => {
    model[field.key] = ''
  })
})

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
  emit('submit', { ...model })
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
                v-if="field.type !== 'select' && field.type !== 'date'"
                :type="field.type"
                v-model="model[field.key]"
                :required="field.required"
              />
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
