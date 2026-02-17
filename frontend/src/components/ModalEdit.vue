<script lang="ts" setup>
import { reactive, watch, onMounted } from 'vue'

interface Props {
  data: Record<string, any>  // Aquí viene tu editDatos
  title?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'close'])

// Modelo editable
const model = reactive({ ...props.data })

// Cuando cambie props.data, actualizar el modelo
watch(() => props.data, (newData) => {
  Object.assign(model, newData)
}, { deep: true })

const save = () => {
  emit('save', { ...model })  // Se envía al parent
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
