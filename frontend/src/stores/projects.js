import { defineStore } from 'pinia'
import { api } from '../api'

export const useProjectStore = defineStore('projects', {
    state: () => ({
        projects: [],
        lastFetch: null,
        isFetching: false,
    }),

    getters: {
        allProjects: (state) => state.projects,
        getProjectById: (state) => (id) => state.projects.find(p => p.idProyecto === id),
    },

    actions: {
        async fetchProjects(force = false) {
            // Si ya tenemos datos y no han pasado 5 minutos, no refetch (a menos que se force)
            const now = Date.now()
            if (!force && this.projects.length > 0 && this.lastFetch && (now - this.lastFetch < 300000)) {
                return this.projects
            }

            if (this.isFetching) return

            this.isFetching = true
            try {
                const res = await api.get('/projects')
                this.projects = res.data
                this.lastFetch = Date.now()
            } catch (error) {
                console.error('Error fetching projects in store:', error)
            } finally {
                this.isFetching = false
            }
        },

        async addProject(newProject) {
            const res = await api.post('/projects', newProject)
            this.projects.push(res.data)
            return res.data
        },

        async updateProject(id, updatedData) {
            const res = await api.put(`/projects/${id}`, updatedData)
            const index = this.projects.findIndex(p => p.idProyecto === id)
            if (index !== -1) {
                this.projects[index] = res.data
            }
            return res.data
        },

        async removeProject(id) {
            await api.delete(`/projects/${id}`)
            this.projects = this.projects.filter(p => p.idProyecto !== id)
        }
    }
})
