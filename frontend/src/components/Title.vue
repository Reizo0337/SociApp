<script lang="ts" setup>
const props = defineProps<{
  title: string
  icon: string
}>()
</script>

<template>
  <div class="title">
    <span class="material-symbols-outlined">{{icon}}</span>
    <h1>{{ title }}</h1>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--card-shadow);
  margin-bottom: 30px;
  justify-content: center;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}
.title h1 {
  margin-left: 10px;
  font-size: 28px;
  color: var(--button-primary);
  transition: color 0.3s ease;
}

.title span {
  font-size: 40px;
  color: var(--button-primary);
  transition: color 0.3s ease;
}
</style>
