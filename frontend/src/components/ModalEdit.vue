<script lang="ts" setup>
import { reactive, watch } from 'vue'

const props = defineProps<{ schema: any[]; initial?: Record<string, any>; error?: string }>()
const emit = defineEmits(['submit', 'close'])

const model = reactive({})

// Inicializar model con valores iniciales (si hay)
props.schema.forEach(section => {
  section.fields.forEach(field => {
    model[field.key] = props.initial && props.initial[field.key] != null ? props.initial[field.key] : ''
  })
})

watch(() => props.initial, (next) => {
  if (!next) return
  props.schema.forEach(section => {
    section.fields.forEach(field => {
      model[field.key] = next[field.key] ?? ''
    })
  })
}, { deep: true })

const submit = () => {
  // Incluir id si existe en initial
  const payload = { ...(props.initial?.id ? { id: props.initial.id } : {}), ...model }
  emit('submit', payload)
}
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Editar actividad</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="submit">
        <div v-if="props.error" class="form-error">{{ props.error }}</div>

        <div class="grid-2">
          <section class="card" v-for="value in schema" :key="value.section">
            <h3>{{ value.section }}</h3>
            <div v-for="field in value.fields" :key="field.key" class="form-group">
              <label>{{ field.label }}</label>

              <input
                v-if="field.type !== 'select' && field.type !== 'date'"
                :type="field.type"
                v-model="model[field.key]"
                :required="field.required"
              />

              <select v-else-if="field.type === 'select'" v-model="model[field.key]" :required="field.required">
                <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
              </select>

              <div v-else-if="field.type === 'date'" class="inline">
                <input type="date" v-model="model[field.key]" :required="field.required" />
                <button type="button" @click="() => { const today = new Date(); model[field.key] = today.toISOString().split('T')[0] }">Hoy</button>
              </div>
            </div>
          </section>
        </div>

        <div class="actions">
          <button type="button" class="secondary" @click="$emit('close')">CANCELAR</button>
          <button type="submit">GUARDAR CAMBIOS</button>
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
  z-index: 999999;
  padding: 20px;
  overflow-y: auto;
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
  position: relative;
  max-height: 100vh;
  max-width: 1000px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
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
  width: 100%;
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
