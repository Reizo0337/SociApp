export const juntaDirectivaSchema = [
  {
    section: 'Datos personales',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'surname', label: 'Apellido', type: 'text', required: true },
      { key: 'dni', label: 'DNI', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Teléfono', type: 'text' },
      { key: 'birthDate', label: 'Fecha de nacimiento', type: 'date' }
    ]
  },
  {
    section: 'Ubicación y Domicilio',
    fields: [
      { key: 'street', label: 'Calle', type: 'text' },
      { key: 'city', label: 'Ciudad', type: 'text' },
      { key: 'postalCode', label: 'CP', type: 'text' },
      { key: 'country', label: 'País', type: 'text' }
    ]
  },
  {
    section: 'Cargo y Responsabilidad',
    fields: [
      {
        key: 'rol',
        label: 'Cargo en la junta',
        type: 'select',
        required:true,
        options: ['Presidente/a', 'Vicepresidente/a', 'Secretario/a', 'Tesorero/a', 'Director/a Ejecutivo/a']
      },
      {
        key: 'status',
        label: 'Estado actual',
        type: 'select',
        options: ['Activo', 'En periodo de cese', 'Honorífico']
      },
      { key: 'fechaNombramiento', label: 'Fecha de nombramiento', type: 'date', required:true },
      { key: 'fechaVencimiento', label: 'Fin de mandato', type: 'date' }
    ]
  },
  {
    section: 'Información Adicional',
    fields: [
      {
        key: 'comite',
        label: 'Comité asignado',
        type: 'select',
        options: ['Finanzas', 'Eventos', 'Relaciones Públicas', 'Ética']
      },
      { key: 'observations', label: 'Observaciones internas', type: 'text' }
    ]
  }
]
