<script lang="ts" setup>
const props = defineProps<{ title: string; message: string; itemName?: string }>()
const emit = defineEmits(['confirm', 'close'])

const confirm = () => {
  emit('confirm')
}
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <!-- HEADER -->
      <div class="modal-header">
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>

      <!-- CONTENIDO PRINCIPAL -->
      <div class="delete-container">
        <div class="warning-icon">⚠️</div>
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <p v-if="itemName" class="item-name"><strong>{{ itemName }}</strong></p>
      </div>

      <!-- BOTONES DE ACCIÓN -->
      <div class="actions">
        <button @click="$emit('close')" class="secondary">Cancelar</button>
        <button @click="confirm" class="danger">Eliminar</button>
      </div>
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
  align-items: center;
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
  background: var(--card-bg);
  border-radius: 12px;
  width: 100%;
  position: relative;
  max-height: auto;
  max-width: 350px;
  padding: 24px;
  box-shadow: 0 10px 40px var(--card-shadow);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 24px;
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.delete-container {
  text-align: center;
  margin: 20px 0;
}

.warning-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.delete-container h3 {
  margin-bottom: 12px;
  font-size: 20px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.delete-container p {
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.item-name {
  background: var(--bg-tertiary);
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
  color: var(--text-primary) !important;
  transition: all 0.3s ease;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.actions button {
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.secondary {
  background: var(--button-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.secondary:hover {
  background: var(--button-secondary-hover);
}

.danger {
  background: #ef4444;
  color: white;
}

.danger:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 90%;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
