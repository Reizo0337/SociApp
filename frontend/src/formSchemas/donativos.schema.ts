export const donativosSchema = [
  {
    section: 'Información del Donativo',
    fields: [
      {
        label: 'Nombre / Entidad',
        key: 'Nombre',
        type: 'text',
        required: true
      },
      {
        label: 'Tipo de Entrada',
        key: 'Tipo',
        type: 'select',
        options: ['Donativo', 'Herencia'],
        required: true
      }
    ]
  },
  {
    section: 'Ubicación y Contacto',
    fields: [
      {
        label: 'Dirección',
        key: 'Direccion',
        type: 'text'
      },
      {
        label: 'Población',
        key: 'Poblacion',
        type: 'text'
      },
      {
        label: 'Código Postal',
        key: 'CP',
        type: 'number'
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
      }
    ]
  },
  {
    section: 'Identificación y Notas',
    fields: [
      {
        label: 'NIF / DNI',
        key: 'NIF',
        type: 'text'
      },
      {
        label: 'Correo Electrónico',
        key: 'Email',
        type: 'email'
      },
      {
        label: 'Notas Adicionales',
        key: 'Notas',
        type: 'text'
      }
    ]
  }
];
