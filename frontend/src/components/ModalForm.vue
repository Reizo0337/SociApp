<script lang="ts" setup>
import { reactive, onMounted } from 'vue'

const props = defineProps<{ schema: any[]; error?: string; initial?: Record<string, any> }>()
const emit = defineEmits(['submit', 'close'])

const model = reactive({})
const resolvedOptions = reactive<Record<string, any[]>>({})

// Inicializar model basado en el schema
console.log(Array.isArray(props.schema), props.schema);
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
        <h2>SociApp</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="submit">
        <div v-if="props.error" class="form-error">{{ props.error }}</div>
        <!-- FILA SUPERIOR: Dos columnas -->
        <div class="grid-2">
          <!-- Columna izquierda: Datos personales -->
          <section class="card" v-for="value in schema">
            <h3>{{ value.section }}</h3>
            <div v-for="field in value.fields" :key="value.section" class="form-group">
              <label>{{ field.label }}</label>
              <input
                v-if="field.type !== 'select' && field.type !== 'date'"
                :type="field.type"
                v-model="model[field.key]"
                :required="field.required"
              />
              <select v-else-if="field.type === 'select'" v-model="model[field.key]" :required="field.required">
                <option disabled value="">-- Selecciona una opción --</option>
                <option v-for="opt in (resolvedOptions[field.key] || (Array.isArray(field.options) ? field.options : []))" :key="opt.value || opt" :value="opt.value || opt">
                  {{ opt.label || opt }}
                </option>
              </select>
              <div v-else-if="field.type === 'date'" class="inline">
                <input type="date" v-model="model[field.key]" :required="field.required" />
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
.modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: flex-start; /* para que el modal empiece desde arriba */
  z-index: 999999;
  padding: 20px;
  overflow-y: auto; /* permite scroll si el contenido es más alto que la pantalla */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 1000px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  position: relative;
  /* eliminar max-height para que pueda crecer */
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 24px;
  cursor: pointer;
  border: none;
  background: transparent;
  color: #000;
}

.card {
  background: #f8fafc;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 20px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  color: #374151;
}

input, select {
  width: 90%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  color: #111827;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.actions button.secondary {
  background: #e5e7eb;
  color: #111827;
  margin-right: 8px;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
}

.actions button[type="submit"] {
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background-color: #2563eb;
  color: white;
}

.form-error {
  background: #fee2e2;
  color: #991b1b;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
