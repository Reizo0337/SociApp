import { api } from '@/api'

export const projectSchema = [
  {
    section: 'Información general del proyecto',
    fields: [
      {
        key: 'nombre',
        label: 'Nombre del proyecto',
        type: 'text',
        required: true
      },
      {
        key: 'descripcion',
        label: 'Descripción',
        type: 'text',
        placeholder: 'Breve descripción del proyecto'
      },
      {
        key: 'estado',
        label: 'Estado del proyecto',
        type: 'select',
        required: true,
        options: ['Activo', 'Pendiente', 'Finalizado']
      }
    ]
  },
  {
    section: 'Actividades',
    fields: [
      {
        key: 'activityIds',
        label: 'Actividades',
        // multiple
        type: 'select',
        multiple: true,
        options: async () => {
          try {
            const response = await api.get('/activities')
            const data = response.data
            // El backend devuelve { activities: [...] } en get()
            const activities = Array.isArray(data) ? data : (data.activities || [])
            return activities.map((activity: any) => ({
              value: activity.id,
              label: activity.name
            }))
          } catch (error) {
            console.error('Error fetching activities for schema:', error)
            return []
          }
        },
      }
    ]
  },
  {
    section: 'Responsables y organización',
    fields: [
      {
        key: 'responsableId',
        label: 'Responsable del proyecto',
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
    section: 'Datos económicos',
    fields: [
      {
        key: 'presupuesto',
        label: 'Presupuesto (€)',
        type: 'number',
        required: true
      },
      {
        key: 'fuenteFinanciacion',
        label: 'Fuente de financiación',
        type: 'select',
        options: ['Fondos propios', 'Subvención', 'Donaciones', 'Mixto']
      }
    ]
  },
  {
    section: 'Fechas del proyecto',
    fields: [
      {
        key: 'startDate',
        label: 'Fecha de inicio',
        type: 'date',
        required: true
      },
      {
        key: 'endDate',
        label: 'Fecha de finalización',
        type: 'date'
      }
    ]
  },
  {
    section: 'Seguimiento',
    fields: [
      {
        key: 'notas',
        label: 'Observaciones',
        type: 'text'
      }
    ]
  },
  {
    section: 'Documentación',
    fields: [
      {
        key: 'pdf',
        label: 'Archivos PDF (Máx. 10MB)',
        type: 'file',
        accept: '.pdf',
        multiple: true
      }
    ]
  }
]
