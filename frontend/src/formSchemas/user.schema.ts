export const userSchema = [
  {
    section: 'Datos personales',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'apellidos', label: 'Apellido', type: 'text', required: true },
      { key: 'dni', label: 'DNI', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'telefono', label: 'Teléfono', type: 'text' }
    ]
  },
  {
    section: 'Dirección',
    fields: [
      { key: 'direccion', label: 'Dirección', type: 'text', required: true },
      { key: 'CP', label: 'Código Postal', type: 'text', required: true },
      { key: 'provincia', label: 'Provincia', type: 'text', required: true },
      { key: 'poblacion', label: 'Población', type: 'text', required: true },
      { key: 'pais', label: 'País', type: 'text', required: true }
    ]
  },
  {
    section: 'Datos de la asociación',
    fields: [
      {
        key: 'categoria',
        label: 'Rol',
        type: 'select',
        options: ['Administrador', 'Monitor', 'Trabajador', 'Voluntario']
      },
      {
        key: 'socio',
        label: 'Tipo de socio',
        type: 'select',
        options: ['Socio', 'NoSocio']
      },
      { key: 'cuota', label: 'Cuota', type: 'number' },
      { key: 'formadepago', label: 'Forma de pago', type: 'select', options: ['Efectivo', 'Tarjeta', 'Transferencia']},
      { key: 'fechaalta', label: 'Fecha de alta', type: 'date' }
    ]
  }
]
