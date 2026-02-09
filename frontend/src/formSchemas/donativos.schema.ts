export const donativosSchema = [
  {
    section: 'Información del Donante / Testador',
    fields: [
      { key: 'fullName', label: 'Nombre completo / Razón Social', type: 'text', required: true },
      { key: 'dni', label: 'DNI / NIF / Pasaporte', type: 'text', required: true },
      { key: 'email', label: 'Email de contacto', type: 'email' },
      {
        key: 'donorType',
        label: 'Tipo de Donante',
        type: 'select',
        options: ['Particular', 'Empresa', 'Fundación', 'Fallecido (Herencia)']
      }
    ]
  },
  {
    section: 'Detalles de la Aportación',
    fields: [
      {
        key: 'type',
        label: 'Tipo de aportación',
        type: 'select',
        required: true,
        options: ['Donativo Económico', 'Donativo en Especie', 'Herencia / Legado', 'Beca']
      },
      { key: 'amount', label: 'Cuantía / Valor estimado (€)', type: 'number', required: true },
      { key: 'date', label: 'Fecha de recepción', type: 'date', required: true },
      {
        key: 'method',
        label: 'Método de pago/traspaso',
        type: 'select',
        options: ['Transferencia', 'Efectivo', 'Tarjeta', 'Escritura Notarial']
      }
    ]
  },
  {
    section: 'Información Legal y Notarial',
    fields: [
      { key: 'notary', label: 'Notaría (si aplica)', type: 'text' },
      { key: 'protocolNumber', label: 'Número de Protocolo', type: 'text' },
      { key: 'certRequired', label: 'Requiere certificado fiscal', type: 'select', options: ['Sí', 'No'] },
      { key: 'purpose', label: 'Finalidad vinculada', type: 'text', placeholder: 'Ej: Proyecto específico' }
    ]
  },
  {
    section: 'Seguimiento',
    fields: [
      {
        key: 'status',
        label: 'Estado del proceso',
        type: 'select',
        options: ['Completado', 'En trámite legal', 'Pendiente de aceptación', 'Rechazado']
      },
      { key: 'notes', label: 'Observaciones adicionales', type: 'text' }
    ]
  }
]
