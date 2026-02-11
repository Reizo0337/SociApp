<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { themeMode, cycleTheme } = useTheme()

const currentIcon = computed(() => {
  if (themeMode.value === 'light') return 'light_mode'
  if (themeMode.value === 'dark') return 'dark_mode'
  return 'brightness_auto'
})
</script>

<template>
  <button class="toggle-switch" @click="cycleTheme" type="button" :aria-label="'Cambiar tema: ' + themeMode">
    <div class="track" :class="themeMode">
      <div class="thumb">
        <transition name="rotate" mode="out-in">
          <span :key="themeMode" class="material-symbols-outlined icon" :class="themeMode">{{ currentIcon }}</span>
        </transition>
      </div>
    </div>
  </button>
</template>

<style scoped>
.toggle-switch {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.track {
  width: 76px;
  height: 28px;
  background-color: #e0e0e0;
  border-radius: 30px;
  position: relative;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  border: 1px solid #d1d1d1;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

.track.dark {
  background-color: #333;
  border-color: #555;
}

.track.auto {
  background-color: #90a4ae;
  border-color: #78909c;
}

.thumb {
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.track.auto .thumb {
  transform: translateX(24px);
}

.track.dark .thumb {
  transform: translateX(48px);
  background-color: #1e1e1e;
}

.icon {
  font-size: 16px;
  line-height: 1;
  user-select: none;
}

.sun { color: #fbc02d; }
.dark { color: #ffffff; }
.auto { color: #546e7a; }
.track.dark .auto { color: #cfd8dc; }

.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.2s ease;
}

.rotate-enter-from {
  transform: rotate(-90deg) scale(0.5);
  opacity: 0;
}

.rotate-leave-to {
  transform: rotate(90deg) scale(0.5);
  opacity: 0;
}
</style>
