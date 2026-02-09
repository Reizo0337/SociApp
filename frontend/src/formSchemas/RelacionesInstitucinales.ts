export const userSchema = [
  {
    section: 'Datos personales',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'surname', label: 'Apellido', type: 'text', required: true },
      { key: 'dni', label: 'DNI', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Teléfono', type: 'text' }
    ]
  },
  {
    section: 'Dirección',
    fields: [
      { key: 'street', label: 'Calle', type: 'text' },
      { key: 'city', label: 'Ciudad', type: 'text' },
      { key: 'postalCode', label: 'CP', type: 'text' },
      { key: 'country', label: 'País', type: 'text' }
    ]
  },
  {
    section: 'Datos de la asociación',
    fields: [
      {
        key: 'rol',
        label: 'Rol',
        type: 'select',
        options: ['Administrador', 'Monitor', 'Trabajador', 'Voluntario']
      },
      {
        key: 'socio',
        label: 'Tipo de socio',
        type: 'select',
        options: ['Socio', 'No socio']
      },
      { key: 'cuota', label: 'Cuota', type: 'number' },
      { key: 'fechaAlta', label: 'Fecha de alta', type: 'date' }
    ]
  }
]
