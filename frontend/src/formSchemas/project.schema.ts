export const projectSchema = [
  {
    section: 'Información general del proyecto',
    fields: [
      {
        key: 'name',
        label: 'Nombre del proyecto',
        type: 'text',
        required: true
      },
      {
        key: 'description',
        label: 'Descripción',
        type: 'text',
        placeholder: 'Breve descripción del proyecto'
      },
      {
        key: 'status',
        label: 'Estado del proyecto',
        type: 'select',
        required: true,
        options: ['Activo', 'Pendiente', 'Finalizado']
      }
    ]
  },
  {
    section: 'Responsables y organización',
    fields: [
      {
        key: 'responsible',
        label: 'Responsable del proyecto',
        type: 'text',
        required: true
      },
      {
        key: 'department',
        label: 'Área / Departamento',
        type: 'select',
        options: ['Cultura', 'Educación', 'Salud', 'Inclusión Social', 'Otros']
      }
    ]
  },
  {
    section: 'Datos económicos',
    fields: [
      {
        key: 'budget',
        label: 'Presupuesto (€)',
        type: 'number',
        required: true
      },
      {
        key: 'fundingSource',
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
        key: 'notes',
        label: 'Observaciones',
        type: 'text'
      }
    ]
  }
]
