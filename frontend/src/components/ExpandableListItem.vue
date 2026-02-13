<script setup>
defineProps({
  expanded: Boolean
})
defineEmits(['toggle'])
</script>

<template>
  <div class="list-item" :class="{ 'expanded': expanded }" @click="$emit('toggle')">
    <div class="summary">
      <div class="summary-left">
        <slot name="summary-left"></slot>
      </div>
      <div class="summary-right">
        <slot name="summary-right"></slot>
        <span class="material-symbols-outlined arrow-icon" :class="{ 'rotated': expanded }">expand_more</span>
      </div>
    </div>

    <div class="details-card" v-if="expanded" @click.stop>
      <slot name="details"></slot>
    </div>
  </div>
</template>

<style scoped>
.list-item {
  position: relative;
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #eee;
}

.list-item:hover, .list-item.expanded {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 10;
  border-color: #2a4ea2;
}

.summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.arrow-icon {
  transition: transform 0.3s ease;
  color: #666;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

.details-card {
  border-top: 1px solid #eee;
  padding: 15px;
  margin-top: 10px;
  border-radius: 6px;
  cursor: default;
}

:global(.dark) .list-item {
  background-color: #0a0a0a;
  border: 1px solid #1e293b;
  color: #f8fafc;
}

:global(.dark) .details-card {
  background-color: #111827;
  border-top: 1px solid #334155;
  color: #f8fafc;
}
</style>
