export const juntaDirectivaSchema = [ // Ahora es un Array
  {
    section: 'Información de la Junta',
    fields: [
      {
        label: 'Seleccionar Persona',
        key: 'idUsuario',      // Cambia 'model' por 'key' para que ModalForm lo lea
        type: 'select',     
        options: [],
        required: true
      },
      {
        label: 'Cargo en la Junta',
        key: 'cargo',          // Cambia 'model' por 'key'
        type: 'text',
        placeholder: 'Ej: Presidente, Tesorero...',
        required: true
      }
    ]
  }
];