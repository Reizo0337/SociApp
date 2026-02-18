import { api } from '@/api'

export const juntaDirectivaSchema = [ // Ahora es un Array
  {
    section: 'Información de la Junta',
    fields: [
      {
        label: 'Seleccionar Usuario',
        key: 'idUsuario',
        type: 'select',
        options: async () => {
          try {
            const response = await api.get('/users')
            const data = response.data
            // El backend devuelve { users: [...] } en get()
            const users = Array.isArray(data) ? data : (data.users || [])
            return users.map((user: any) => ({
              value: user.id,
              label: `${user.nombre} ${user.apellidos || ''}`.trim()
            }))
          } catch (error) {
            console.error('Error fetching users for schema:', error)
            return []
          }
        },
        required: true
      },
    ]
  },
  {
    section: 'Información de la Junta',
    fields: [
      {
        label: 'Cargo en la Junta',
        key: 'cargo',          // Cambia 'model' por 'key'
        type: 'select',
        options: async () => {
          const response = await api.get('/configuracion/junta/cargos');
          console.log(response.data);
          return response.data; // ya viene en formato {value,label}
        },
        required: true
      }
    ]
  }
];