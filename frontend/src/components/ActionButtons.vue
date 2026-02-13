<template>
  <div class="action-buttons">
    <button
      v-if="showEdit"
      @click.stop="$emit('edit')"
      class="action-btn edit-btn"
      title="Editar"
    >
      <span class="material-symbols-outlined">edit</span>
    </button>
    <button
      v-if="showDelete"
      @click.stop="$emit('delete')"
      class="action-btn delete-btn"
      title="Eliminar"
    >
      <span class="material-symbols-outlined">delete</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showEdit?: boolean
  showDelete?: boolean
}>()

defineEmits<{
  edit: []
  delete: []
}>()
</script>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: start;
  align-items: start;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--bg-tertiary);
}

.edit-btn .material-symbols-outlined {
  color: #2563eb;
  font-size: 1.2rem;
}

.delete-btn .material-symbols-outlined {
  color: #ef4444;
  font-size: 1.2rem;
}

:global(.dark) .action-btn .material-symbols-outlined {
  color: var(--text-secondary);
}

:global(.dark) .edit-btn:hover .material-symbols-outlined {
  color: #60a5fa;
}

:global(.dark) .delete-btn:hover .material-symbols-outlined {
  color: #f87171;
}
</style>
