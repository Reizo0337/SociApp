import { defineStore } from 'pinia'
import { api } from '../api'

export const useConfiguracionStore = defineStore('configuracion', {
    state: () => ({
        asociacionData: null,
        listaJunta: [],
        listaRelaciones: [],
        listaBancos: [],
        listaDonativos: [],
        listaUsuariosParaSelect: [],
        loading: false,
        error: null
    }),

    actions: {
        // Centralizamos el mapa para no repetirlo y evitar errores de dedo
        getEndpoint(section) {
            const map = {
                junta: 'junta',
                bancos: 'bancos',
                relaciones: 'relaciones',
                donativos: 'donativos'
            }
            return map[section]
        },

        async fetchConfiguracion() {
            this.loading = true
            try {
                const { data } = await api.get('/configuracion/datos')
                this.asociacionData = data
            } catch (error) {
                this.error = error
                console.error('Error cargando configuración:', error)
            } finally {
                this.loading = false
            }
        },

        async updateConfiguracion(updatedData) {
            this.loading = true
            try {
                // Cambiado a PUT para coincidir con tu service NestJS que hace el upsert
                const { data } = await api.put('/configuracion/datos', updatedData)
                this.asociacionData = data
                return data
            } catch (error) {
                this.error = error
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchSection(section) {
            if (section === 'datos') return this.fetchConfiguracion()

            this.loading = true
            try {
                const endpoint = this.getEndpoint(section)
                if (!endpoint) return

                const { data } = await api.get(`/configuracion/${endpoint}`)

                // Mapeo dinámico al estado
                const stateMap = {
                    junta: 'listaJunta',
                    bancos: 'listaBancos',
                    relaciones: 'listaRelaciones',
                    donativos: 'listaDonativos'
                }
                this[stateMap[section]] = data

            } catch (error) {
                this.error = error
                console.error(`Error cargando ${section}:`, error)
            } finally {
                this.loading = false
            }
        },

        async createItem(section, itemData) {
            this.loading = true
            try {
                const endpoint = this.getEndpoint(section)
                if (!endpoint) throw new Error('Sección inválida')

                // Enviamos el POST al endpoint correspondiente
                await api.post(`/configuracion/${endpoint}`, itemData)

                // Refrescamos la lista automáticamente
                await this.fetchSection(section)
            } catch (error) {
                this.error = error
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateItem(section, id, itemData) {
            this.loading = true
            try {
                const endpoint = this.getEndpoint(section)
                if (!endpoint) throw new Error('Sección inválida')

                // IMPORTANTE: id ya viene con el nombre correcto desde el sectionIdMap del componente
                await api.put(`/configuracion/${endpoint}/${id}`, itemData)

                await this.fetchSection(section)
            } catch (error) {
                this.error = error
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteItem(section, id) {
            this.loading = true
            try {
                const endpoint = this.getEndpoint(section)
                if (!endpoint) throw new Error('Sección inválida')

                await api.delete(`/configuracion/${endpoint}/${id}`)

                await this.fetchSection(section)
            } catch (error) {
                this.error = error
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchUsuariosSelect() {
            try {
                const { data } = await api.get('/configuracion/junta/usuarios-lista')
                this.listaUsuariosParaSelect = data.map(u => ({
                    label: `${u.Nombre} ${u.Apellidos}`,
                    value: u.idUsuario
                }))
                return this.listaUsuariosParaSelect
            } catch (error) {
                console.error("Error cargando usuarios:", error)
                return []
            }
        }
    }
})
