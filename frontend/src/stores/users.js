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
                const rawUsers = Array.isArray(data) ? data : (data.users || [])

                // Normalizar a nombres de backend (poblacion, fechaalta)
                this.users = rawUsers.map(u => ({
                    ...u,
                    poblacion: u.poblacion || u.localidad || '',
                    fechaalta: u.fechaalta || u.fechadealta || '',
                    fechabaja: u.fechabaja || u.fechadebaja || null
                }))

                this.lastFetch = Date.now()
            } catch (error) {
                console.error('Error fetching users in store:', error)
            } finally {
                this.isFetching = false
            }
        },

        async addUser(newUser) {
            // Limpiar datos antes de enviar - Whitelist para evitar "forbidNonWhitelisted"
            const payload = { ...newUser };

            // Forzar DNI como string
            if (payload.dni !== undefined && payload.dni !== null) {
                payload.dni = String(payload.dni);
            }

            // Eliminar propiedades no permitidas por el DTO de creación
            delete payload.id;
            delete payload.fechadealta;
            delete payload.localidad;

            // Asegurar fecha de alta válida (CreateUserDto la requiere y no es opcional)
            if (!payload.fechaalta || payload.fechaalta === '') {
                payload.fechaalta = new Date().toISOString().split('T')[0];
            }

            const response = await api.post('/users', payload)
            const savedUser = response.data
            this.users.unshift(savedUser)
            return savedUser
        },

        async updateUser(payload) {
            // Limpiar y normalizar para backend - Whitelist
            const payloadForBackend = { ...payload };

            // Eliminar propiedades no permitidas por el DTO de edición
            delete payloadForBackend.id;

            if (payloadForBackend.localidad) {
                payloadForBackend.poblacion = payloadForBackend.localidad;
                delete payloadForBackend.localidad;
            }
            if (payloadForBackend.fechadealta) {
                payloadForBackend.fechaalta = payloadForBackend.fechadealta;
                delete payloadForBackend.fechadealta;
            }
            if (payloadForBackend.fechadebaja) {
                payloadForBackend.fechabaja = payloadForBackend.fechadebaja;
                delete payloadForBackend.fechadebaja;
            }

            // Forzar DNI como string
            if (payloadForBackend.dni !== undefined && payloadForBackend.dni !== null) {
                payloadForBackend.dni = String(payloadForBackend.dni);
            }

            // Asegurar fecha de alta válida (EditUserDto la requiere)
            if (!payloadForBackend.fechaalta || payloadForBackend.fechaalta === '') {
                payloadForBackend.fechaalta = new Date().toISOString().split('T')[0];
            }

            const res = await api.post('/users/edit', payloadForBackend)
            const updatedUser = res.data

            const idx = this.users.findIndex(u => u.dni === updatedUser.dni)
            if (idx !== -1) {
                this.users[idx] = updatedUser
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
