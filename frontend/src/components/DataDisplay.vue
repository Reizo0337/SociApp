<template>
  <div class="data-display">
    <p v-for="(item, index) in items" :key="index">
      <strong v-if="item.label">{{ item.label }}:</strong>
      <span>{{ item.value || '-' }}</span>
    </p>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items?: Array<{ label?: string; value: string | number | null | undefined }>
}>()
</script>

<style scoped>
.data-display {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.data-display p {
  margin: 5px 0;
  font-size: 14px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.data-display strong {
  color: var(--text-primary);
  font-weight: 600;
  transition: color 0.3s ease;
}
</style>
