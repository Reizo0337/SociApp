export const bancosSchema = [
  {
    section: 'Identificación y Asociación',
    fields: [
      {
        label: 'Nombre del Banco',
        key: 'Nombre',
        type: 'text',
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
        label: 'Código Postal',
        key: 'CodigoPostal',
        type: 'number'
      },
      {
        label: 'Población',
        key: 'Poblacion',
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
      }
    ]
  },
  {
    section: 'Datos Técnicos Bancarios',
    fields: [
      {
        label: 'Código de Negocio',
        key: 'CodigoNegocio',
        type: 'text'
      },
      {
        label: 'Referencia SEPA',
        key: 'Referencia_SEPA',
        type: 'text'
      },
      {
        label: 'IBAN',
        key: 'IBAN',
        type: 'text',
        required: true
      },
      {
        label: 'BIC / SWIFT',
        key: 'Swift',
        type: 'text'
      }
    ]
  }
];
