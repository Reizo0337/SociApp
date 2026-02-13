<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['primary-button', { 'small': small }]"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  small?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.primary-button {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--button-primary);
  color: #fff;
  font-weight: 500;
}

.primary-button:hover:not(:disabled) {
  background-color: var(--button-primary-hover);
}

.primary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary-button.small {
  padding: 8px 12px;
  font-size: 12px;
}
</style>
