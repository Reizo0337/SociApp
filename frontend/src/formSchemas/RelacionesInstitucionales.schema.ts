export const RelacionesInstitucionalesSchema = [
  {
    section: 'Información de la Institución',
    fields: [
      {
        label: 'ID Institución',
        key: 'IdInstitucion',
        type: 'number',
        required: true
      },
      {
        label: 'ID Asociación',
        key: 'IdAsociacion',
        type: 'number',
        required: true
      },
      {
        label: 'Nombre de la Institución',
        key: 'Nombre',
        type: 'text',
        required: true
      },
      {
        label: 'Dirección',
        key: 'Direccion',
        type: 'text'
      },
      {
        label: 'Código Postal',
        key: 'CP',
        type: 'number'
      },
      {
        label: 'Población',
        key: 'Poblacion',
        type: 'text'
      },
      {
        label: 'Provincia',
        key: 'Provincia',
        type: 'text'
      },
      {
        label: 'País',
        key: 'Pais',
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
        label: 'Web',
        key: 'Web',
        type: 'text'
      },
      {
        label: 'Notas adicionales',
        key: 'Notas',
        type: 'text'
      }
    ]
  }
];
