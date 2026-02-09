export const datosSchema = [
  {
    section: 'Información Legal',
    fields: [
      { key: 'legalName', label: 'Nombre Legal / Razón Social', type: 'text', required: true },
      { key: 'cif', label: 'CIF / Número de Registro', type: 'text', required: true },
      { key: 'foundationDate', label: 'Fecha de Constitución', type: 'date' },
      {
        key: 'legalType',
        label: 'Tipo de Entidad',
        type: 'select',
        options: ['Asociación Cultural', 'ONG / Fundación', 'Federación', 'Asociación Juvenil', 'Club Deportivo']
      }
    ]
  },
  {
    section: 'Sede Social',
    fields: [
      { key: 'address', label: 'Dirección Fiscal', type: 'text', required: true },
      { key: 'city', label: 'Ciudad', type: 'text', required: true },
      { key: 'postalCode', label: 'Código Postal', type: 'text' },
      { key: 'province', label: 'Provincia / Estado', type: 'text' },
      { key: 'country', label: 'País', type: 'text' }
    ]
  },
  {
    section: 'Contacto Oficial',
    fields: [
      { key: 'generalEmail', label: 'Email General', type: 'email', required: true },
      { key: 'generalPhone', label: 'Teléfono de contacto', type: 'text' },
      { key: 'website', label: 'Sitio Web Oficial', type: 'text' },
      { key: 'representative', label: 'Representante Legal', type: 'text' }
    ]
  },
  {
    section: 'Configuración Operativa',
    fields: [
      {
        key: 'cuotaBase',
        label: 'Cuota de Socio General (€)',
        type: 'number'
      },
      {
        key: 'moneda',
        label: 'Moneda de gestión',
        type: 'select',
        options: ['EUR (€)', 'USD ($)', 'MXN ($)', 'CLP ($)']
      },
      { key: 'bankAccount', label: 'IBAN / Cuenta Bancaria', type: 'text' },
      { key: 'activityArea', label: 'Ámbito de actuación', type: 'text' }
    ]
  }
]
