import { defineStore } from 'pinia'
import { api } from '../api'

export const useUserStore = defineStore('users', {
    state: () => ({
        users: [],
        lastFetch: null,
        isFetching: false,
    }),

    actions: {
        async fetchUsers(force = false) {
            const now = Date.now()
            if (!force && this.users.length > 0 && this.lastFetch && (now - this.lastFetch < 300000)) {
                return this.users
            }

            if (this.isFetching) return

            this.isFetching = true
            try {
                const response = await api.get('/users')
                const data = response.data
                this.users = Array.isArray(data) ? data : (data.users || [])
                this.lastFetch = Date.now()
            } catch (error) {
                console.error('Error fetching users in store:', error)
            } finally {
                this.isFetching = false
            }
        },

        async addUser(newUser) {
            const response = await api.post('/users', newUser)
            const savedUser = response.data
            this.users.unshift(savedUser)
            return savedUser
        },

        async updateUser(payload) {
            // Mapeo para backend
            const payloadForBackend = { ...payload };
            if (payloadForBackend.localidad) {
                payloadForBackend.poblacion = payloadForBackend.localidad;
                delete payloadForBackend.localidad;
            }

            const res = await api.post('/users/edit', payloadForBackend)
            const updatedUser = res.data

            const idx = this.users.findIndex(u => u.dni === updatedUser.dni)
            if (idx !== -1) {
                // Mapeo para vista
                const userForView = {
                    nombre: updatedUser.nombre,
                    apellidos: updatedUser.apellidos,
                    dni: updatedUser.dni,
                    direccion: updatedUser.direccion,
                    CP: updatedUser.CP,
                    provincia: updatedUser.provincia,
                    localidad: updatedUser.poblacion,
                    pais: updatedUser.pais,
                    email: updatedUser.email,
                    telefono: updatedUser.telefono,
                    fechadealta: updatedUser.fechadealta,
                    fechadebaja: updatedUser.fechabaja,
                    formadepago: updatedUser.formadepago,
                    cuota: Number(updatedUser.cuota) || 0,
                    categoria: updatedUser.categoria,
                    socio: updatedUser.socio
                }
                this.users[idx] = userForView
            }
            return updatedUser
        },

        async removeUser(dni) {
            await api.post('/users/delete', { dni })
            this.users = this.users.filter(u => u.dni !== dni)
        },
        async sendEmail(data) {
            if (data.recipients && data.recipients.length > 0) {
                return api.post('/mail/send', {
                    to: data.recipients,
                    subject: data.subject,
                    message: data.message
                });
            } else {
                return api.post('/mail/send-all', {
                    subject: data.subject,
                    message: data.message
                });
            }
        }
    }
})
