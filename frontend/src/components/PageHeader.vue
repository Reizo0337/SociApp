<template>
  <div class="page-header">
    <h2>{{ title }}</h2>
    <div class="header-actions">
      <slot name="actions"></slot>
      <SearchInput
        v-if="showSearch"
        :placeholder="searchPlaceholder"
        v-model="searchValue"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SearchInput from './SearchInput.vue'

const props = defineProps<{
  title: string
  showSearch?: boolean
  searchPlaceholder?: string
  searchModelValue?: string
}>()

const emit = defineEmits<{
  'update:searchModelValue': [value: string]
}>()

const searchValue = ref(props.searchModelValue || '')

watch(searchValue, (newVal) => {
  emit('update:searchModelValue', newVal)
})

watch(() => props.searchModelValue, (newVal) => {
  if (newVal !== undefined) {
    searchValue.value = newVal
  }
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 22px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
