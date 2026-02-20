<script setup>
defineProps({
  expanded: Boolean,
  showArrow: {
    type: Boolean,
    default: true
  }
})
defineEmits(['toggle'])
</script>

<template>
  <div
    class="list-item"
    :class="{ expanded: expanded }"
    @click="$emit('toggle')"
  >
    <div class="summary">
      <div class="summary-left">
        <slot name="summary-left"></slot>
      </div>
      <div class="summary-right">
        <slot name="summary-right"></slot>
        <span
          v-if="showArrow"
          class="material-symbols-outlined arrow-icon"
          :class="{ rotated: expanded }"
          >expand_more</span
        >
      </div>
    </div>

    <transition name="expand">
  <div
    v-show="expanded"
    class="details-card"
    @click.stop
  >
    <slot name="details"></slot>
  </div>
</transition>
  </div>
</template>

<style scoped>
.list-item {
  position: relative;
  background-color: var(--card-bg);
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px var(--card-shadow);
  cursor: pointer;
  border: 1px solid var(--border-color);
  transform: translateY(0);

  transition: 
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.content {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: 
    max-height 0.4s ease,
    opacity 0.3s ease;
}
.expand-enter-active,
.expand-leave-active {
  transition: 
    max-height 0.4s cubic-bezier(.4,0,.2,1),
    opacity 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
.list-item.open .content {
  max-height: 500px; /* más grande que el contenido real */
  opacity: 1;
}

.list-item:hover,
.list-item.expanded {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px var(--card-shadow-hover);
  z-index: 10;
  border-color: var(--button-primary);
}

.summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .summary {
    flex-direction: column;
    align-items: flex-start;
  }
  .summary-right {
    width: 100%;
    justify-content: space-between;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--border-color);
  }
}

.summary-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.arrow-icon {
  transition:
    transform 0.3s ease,
    color 0.3s ease;
  color: var(--text-secondary);
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

.details-card {
  border-top: 1px solid var(--border-color);
  padding: 15px;
  margin-top: 10px;
  border-radius: 6px;
  cursor: default;
  transition: all 0.3s ease;
}
</style>
