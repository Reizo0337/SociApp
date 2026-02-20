<script setup>
defineProps({
  expanded: Boolean,
  showArrow: {
    type: Boolean,
    default: true
  }
})
import { nextTick } from 'vue'

const enter = (el, done) => {
  el.style.height = '0'
  el.style.opacity = '0'
  el.style.overflow = 'hidden'
  
  // Force reflow
  el.offsetHeight
  
  el.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  
  const onTransitionEnd = (e) => {
    if (e.propertyName === 'height') {
      el.style.height = 'auto'
      done()
    }
  }
  el.addEventListener('transitionend', onTransitionEnd, { once: true })
}

const leave = (el, done) => {
  // Aseguramos que tenga una altura fija antes de transicionar a 0
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  el.style.overflow = 'hidden'
  
  // Force reflow
  el.offsetHeight
  
  el.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
  el.style.height = '0'
  el.style.opacity = '0'
  
  el.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'height') {
      done()
    }
  }, { once: true })
}
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

    <transition
      :css="false"
      @enter="enter"
      @leave="leave"
    >
      <div
        v-if="expanded"
        class="details-card"
        @click.stop
      >
        <div class="details-content">
          <slot name="details"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.list-item {
  position: relative;
  background-color: var(--card-bg);
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--card-shadow);
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-item:hover,
.list-item.expanded {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px var(--card-shadow-hover);
  z-index: 10;
  border-color: var(--button-primary);
}

.summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  transition: padding 0.3s ease;
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
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--text-secondary);
  font-size: 24px;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
  color: var(--button-primary);
}

.details-card {
  border-top: 1px solid var(--border-color);
  cursor: default;
  overflow: hidden;
  margin-top: 10px;
}

.details-content {
  padding: 15px 5px;
  opacity: 1;
}

/* Animations are handled via JS hooks for height: auto support */
</style>
