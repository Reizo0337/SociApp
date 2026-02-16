import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: []
    }),
    actions: {
        notify(message, type = 'info', duration = 5000) {
            const id = Date.now() + Math.random()
            const notification = {
                id,
                message,
                type, // 'success', 'error', 'warning', 'info'
                icon: this.getIcon(type)
            }

            this.notifications.push(notification)

            if (duration > 0) {
                setTimeout(() => {
                    this.remove(id)
                }, duration)
            }
        },

        success(message, duration) {
            this.notify(message, 'success', duration)
        },

        error(message, duration) {
            this.notify(message, 'error', duration)
        },

        warning(message, duration) {
            this.notify(message, 'warning', duration)
        },

        info(message, duration) {
            this.notify(message, 'info', duration)
        },

        remove(id) {
            this.notifications = this.notifications.filter(n => n.id !== id)
        },

        getIcon(type) {
            switch (type) {
                case 'success': return 'check_circle'
                case 'error': return 'error'
                case 'warning': return 'warning'
                case 'info': return 'info'
                default: return 'notifications'
            }
        }
    }
})
