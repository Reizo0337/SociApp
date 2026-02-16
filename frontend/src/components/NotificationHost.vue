<script setup lang="js">
import { useNotificationStore } from '../stores/notification'

const notificationStore = useNotificationStore()

const remove = (id) => {
  notificationStore.remove(id)
}
</script>

<template>
  <div class="notification-container">
    <TransitionGroup name="list">
      <div 
        v-for="notification in notificationStore.notifications" 
        :key="notification.id" 
        :class="['notification-item', notification.type]"
        @click="remove(notification.id)"
      >
        <span class="material-symbols-outlined icon">{{ notification.icon }}</span>
        <div class="content">
          {{ notification.message }}
        </div>
        <span class="material-symbols-outlined close">close</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  max-width: 350px;
  width: 100%;
}

.notification-item {
  pointer-events: auto;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.icon {
  font-size: 24px;
}

.content {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.close {
  font-size: 18px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.notification-item:hover .close {
  opacity: 1;
}

/* Tipos */
.success {
  border-left: 5px solid #22c55e;
}
.success .icon { color: #22c55e; }

.error {
  border-left: 5px solid #ef4444;
}
.error .icon { color: #ef4444; }

.warning {
  border-left: 5px solid #f59e0b;
}
.warning .icon { color: #f59e0b; }

.info {
  border-left: 5px solid var(--button-primary);
}
.info .icon { color: var(--button-primary); }

/* Animaciones */
.list-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.list-leave-active {
  position: absolute;
}
</style>
