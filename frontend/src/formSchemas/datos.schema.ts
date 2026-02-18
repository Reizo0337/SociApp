export const datosSchema = [
  {
    section: 'Información Legal',
    fields: [
      { key: 'Nombre', label: 'Nombre Legal / Razón Social', type: 'text', required: true },
      { key: 'CIF', label: 'CIF / Número de Registro', type: 'text', required: true },
    ]
  },
  {
    section: 'Sede Social',
    fields: [
      { key: 'Direccion', label: 'Dirección Fiscal', type: 'text', required: true },
      { key: 'CP', label: 'Código Postal', type: 'text' },
    ]
  },
  {
    section: 'Contacto Oficial',
    fields: [
      { key: 'Email', label: 'Email General', type: 'email', required: true },
      { key: 'Telefono', label: 'Teléfono de contacto', type: 'text' },
      { key: 'Web', label: 'Sitio Web Oficial', type: 'text' }
    ]
  }
]
