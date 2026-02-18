import { api } from '@/api'

export interface ActivityFormData {
  name?: string
  place?: string
  diaSemana?: string
  horaInicio?: string
  horaFin?: string
  idMonitor?: number
  hasProject?: boolean
  idProyecto?: number
}

export const ActivitySchema = [
  {
    section: 'Datos de la actividad',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'place', label: 'Lugar', type: 'text', required: true },
      {
        key: 'diaSemana',
        label: 'Día de la semana',
        type: 'select',
        required: true,
        options: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
      },
      {
        key: 'horaInicio',
        label: 'Hora inicio',
        type: 'select',
        required: true,
        options: [
          '10:00', '11:00', '12:00', '13:00', '17:00', '18:00', '19:00', '20:00'
        ]
      },
      {
        key: 'horaFin',
        label: 'Hora fin',
        type: 'select',
        required: true,
        options: [
          '10:00', '11:00', '12:00', '13:00', '17:00', '18:00', '19:00', '20:00'
        ]
      },
      {
        key: 'idMonitor',          // <-- clave en model
        label: 'Monitor',
        type: 'select',
        options: async () => {
          const response = await api.get('/activities/Monitors');
          const data: { id: number; nombre: string }[] = response.data;
          return data.map((monitor) => ({ value: monitor.id, label: monitor.nombre }));
        }
      },
      {
        key: 'asociarProyecto',
        label: 'Asociar a un proyecto',
        type: 'checkbox'
      },
      {
        key: 'projectIds',
        label: 'Proyectos Relacionados',
        type: 'select',
        multiple: true,
        showIf: (model: any) => model.asociarProyecto,
        options: async () => {
          const response = await api.get('/activities/Projects');
          const data: { id: number; nombre: string }[] = response.data;
          return data.map((project) => ({ value: project.id, label: project.nombre }));
        },
        visibleIf: (formData: ActivityFormData) => formData.hasProject
      }
    ],
  },
]
