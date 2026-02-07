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
  background-color: #f8fafd;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

.title h1 {
  margin-left: 10px;
  font-size: 28px;
  color: #2a4ea2;
}

.title span {
  font-size: 40px;
  color: #2a4ea2;
}
</style>
