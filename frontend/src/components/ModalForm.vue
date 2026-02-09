<script lang="ts" setup>
import { reactive } from 'vue'

const props = defineProps<{ schema: any[] }>()
const emit = defineEmits(['submit', 'close'])

const model = reactive({})

// Inicializar model basado en el schema
props.schema.forEach(section => {
  section.fields.forEach(field => {
    model[field.key] = ''
  })
})

// Función submit
const submit = () => {
  emit('submit', { ...model })
}

// Fecha actual
const setToday = (key: string) => {
  const today = new Date()
  letmodel[key] = today.toISOString().split('T')[0]
}
</script>

<template>

  <div class="modal" @click="$emit('close')">
    <div class="modal-content">
      <!-- HEADER -->
      <div class="modal-header">
        <h2>Agregar Usuario</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="submit">
        <!-- FILA SUPERIOR: Dos columnas -->
        <div class="grid-2">
          <!-- Columna izquierda: Datos personales -->
          <section class="card">
            <h3>{{ schema[0].section }}</h3>
            <div v-for="field in schema[0].fields" :key="field.key" class="form-group">
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
                <button type="button" @click="setToday(field.key)">Hoy</button>
              </div>
            </div>
          </section>

          <!-- Columna derecha: Dirección -->
          <section class="card">
            <h3>{{ schema[1].section}}</h3>
            <div v-for="field in schema[1].fields" :key="field.key" class="form-group">
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
                <button type="button" @click="setToday(field.key)">Hoy</button>
              </div>
            </div>
          </section>
        </div>

        <!-- FILA INFERIOR: Datos de la asociación -->
        <section class="card">
          <h3>{{ schema[2].section }}</h3>
          <div class="grid-3">
            <div v-for="field in schema[2].fields" :key="field.key" class="form-group">
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
                <button type="button" @click="setToday(field.key)">Hoy</button>
              </div>
            </div>
          </div>
        </section>

        <!-- BOTÓN SUBMIT -->
        <div class="actions">
          <button type="submit">Guardar usuario</button>
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
  z-index: 9999;
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
  max-width: 900px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  min-height: 900px;

}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 24px;
  cursor: pointer;
  border: none;
  background: transparent;
}

.card {
  background: #f8fafc;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 20px;
}

.card h3 {
  margin-bottom: 16px;
  font-size: 16px;
  color: #1f2937;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
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

input:focus, select:focus {
  outline: none;
  border-color: #2563eb;
}

.inline {
  display: flex;
  gap: 10px;
}

.inline button {
  padding: 8px 12px;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.inline button:hover {
  background: #1d4ed8;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.actions button {
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background-color: #2563eb;
  color: white;
  cursor: pointer;
}

.actions button:hover {
  background-color: #1d4ed8;
}

@media (max-width: 768px) {
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
