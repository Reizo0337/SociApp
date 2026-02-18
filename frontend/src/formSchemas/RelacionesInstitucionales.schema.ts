export const RelacionesInstitucionalesSchema = [
  {
    section: 'Datos de la Institución',
    fields: [
      {
        label: 'Nombre de la Institución',
        key: 'Nombre', // Coincide con tu columna "Nombre"
        type: 'text',
        required: true
      },
      {
        label: 'Dirección',
        key: 'Direccion', // Coincide con tu columna "Direccion"
        type: 'text'
      },
      {
        label: 'Código Postal',
        key: 'CP', // Coincide con tu columna "CP"
        type: 'number'
      },
      {
        label: 'Población',
        key: 'Poblacion',
        type: 'text'
      },
      {
        label: 'Teléfono',
        key: 'Telefono',
        type: 'text'
      },
      {
        label: 'Email',
        key: 'Email',
        type: 'email'
      },
      {
        label: 'Notas adicionales',
        key: 'Notas',
        type: 'text'
      }
    ]
  }
];