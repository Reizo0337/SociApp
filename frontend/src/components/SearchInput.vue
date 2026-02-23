<template>
  <input
    type="text"
    :placeholder="placeholder"
    v-model="localValue"
    class="search-input"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  placeholder?: string
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = ref(props.modelValue)
let timeout: any = null

watch(localValue, (newVal) => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('update:modelValue', newVal)
  }, 300)
})

watch(() => props.modelValue, (newVal) => {
  if (newVal !== localValue.value) {
    localValue.value = newVal
  }
})
</script>

<style scoped>
.search-input {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 14px;
  cursor: text;
  transition: all 0.3s ease;
  width: 220px;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-input:focus {
  border-color: var(--button-primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(42, 78, 162, 0.2);
}
</style>
