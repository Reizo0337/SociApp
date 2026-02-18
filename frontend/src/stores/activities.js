import { defineStore } from 'pinia'
import { api } from '../api'

export const useActivityStore = defineStore('activities', {
    state: () => ({
        activities: [],
        lastFetch: null,
        isFetching: false,
    }),

    actions: {
        async fetchActivities(force = false) {
            const now = Date.now()
            if (!force && this.activities.length > 0 && this.lastFetch && (now - this.lastFetch < 300000)) {
                return this.activities
            }

            if (this.isFetching) return

            this.isFetching = true
            try {
                const response = await api.get('/activities')
                this.activities = response.data.activities || []
                this.lastFetch = Date.now()
            } catch (error) {
                console.error('Error fetching activities in store:', error)
            } finally {
                this.isFetching = false
            }
        },

        async addActivity(newActivity) {
            const response = await api.post('/activities', newActivity)
            const savedActivity = response.data
            // Evitar duplicados si por algún motivo ya existe en el estado local
            const exists = this.activities.some(a => a.id === savedActivity.id)
            if (!exists) {
                this.activities.push(savedActivity)
            }
            return savedActivity
        },

        async updateActivity(id, updatedData) {
            const res = await api.put(`/activities/${id}`, updatedData)
            const updated = res.data
            const index = this.activities.findIndex(a => a.id === id)
            if (index !== -1) {
                this.activities[index] = updated
            }
            return updated
        },

        async removeActivity(id) {
            await api.delete(`/activities/${id}`)
            this.activities = this.activities.filter(a => a.id !== id)
        }
    }
})
