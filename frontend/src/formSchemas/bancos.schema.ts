export const bancosSchema = [
  {
    section: 'Identificación de la Entidad',
    fields: [
      { key: 'bankName', label: 'Nombre del Banco', type: 'text', required: true },
      { key: 'officeAddress', label: 'Dirección de la Sucursal', type: 'text' },
      { key: 'accountAlias', label: 'Alias de la cuenta', type: 'text', placeholder: 'Ej: Cuenta Operativa, Fondo Reserva...' }
    ]
  },
  {
    section: 'Datos Bancarios Técnicos',
    fields: [
      { key: 'iban', label: 'IBAN / Número de Cuenta', type: 'text', required: true },
      { key: 'bicSwift', label: 'BIC / SWIFT', type: 'text' },
      {
        key: 'accountType',
        label: 'Tipo de Cuenta',
        type: 'select',
        options: ['Cuenta Corriente', 'Ahorro', 'Inversión', 'Línea de Crédito']
      },
      { key: 'currency', label: 'Divisa', type: 'select', options: ['EUR (€)', 'USD ($)', 'GBP (£)'] }
    ]
  },
  {
    section: 'Autorizados y Firmas',
    fields: [
      { key: 'signatories', label: 'Personas autorizadas (Firmas)', type: 'text', placeholder: 'Ej: Presidente y Tesorero' },
      {
        key: 'signatureType',
        label: 'Tipo de Firma',
        type: 'select',
        options: ['Mancomunada (Conjunta)', 'Solidaria (Indistinta)', 'Apoderado único']
      }
    ]
  },
  {
    section: 'Estado y Saldos',
    fields: [
      { key: 'openingDate', label: 'Fecha de apertura', type: 'date' },
      {
        key: 'status',
        label: 'Estado de la cuenta',
        type: 'select',
        options: ['Activa', 'Inactiva', 'En proceso de cierre']
      },
      { key: 'onlineAccess', label: 'Tiene acceso online', type: 'select', options: ['Sí', 'No'] },
      { key: 'notes', label: 'Observaciones (Comisiones, condiciones...)', type: 'text' }
    ]
  }
]
