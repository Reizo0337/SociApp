<script lang="ts" setup>
import { reactive, watch, onMounted } from 'vue'
import { useNotificationStore } from '../stores/notification'


const props = defineProps<{
  schema: any[]
  initial?: Record<string, any>
  error?: string
}>()
const emit = defineEmits(['submit', 'close'])
const notificationStore = useNotificationStore()

// Modelo editable
const model = reactive({ ...props.data })

// Cuando cambie props.data, actualizar el modelo
watch(() => props.data, (newData) => {
  Object.assign(model, newData)
}, { deep: true })


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
  if (payload.id) delete payload.id;

  emit('submit', payload)
}
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ props.title || 'Editar' }}</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="save">
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" v-model="model.Nombre" required />
        </div>

        <div class="form-group">
          <label>CIF</label>
          <input type="text" v-model="model.CIF" required />
        </div>

        <div class="actions">
          <button type="button" @click="$emit('close')">Cancelar</button>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/modals.css';
</style>
