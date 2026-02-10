export const projectSchema = [
  {
    section: 'Datos del proyecto',
    fields: [
      {
        key: 'nombre',
        label: 'Nombre del proyecto',
        type: 'text',
        required: true
      },
      {
        key: 'responsable',
        label: 'Responsable',
        type: 'text',
        required: true
      },
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        options: ['Activo', 'Pendiente', 'Finalizado'],
        required: true
      },
      {
        key: 'presupuesto',
        label: 'Presupuesto (€)',
        type: 'number',
        required: true
      }
    ]
  },
  {
    section: 'Fechas',
    fields: [
      {
        key: 'fechaInicio',
        label: 'Fecha de inicio',
        type: 'date'
      },
      {
        key: 'fechaFin',
        label: 'Fecha de fin',
        type: 'date'
      }
    ]
  }
]
