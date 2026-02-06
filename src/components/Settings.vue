<template>
  <div class="settings-section">
    <h2>{{ title }}</h2>
    <p>
      Esta sección todavía no tiene contenido, pero puedes agregar formularios o
      tablas aquí.
    </p>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  props: {
    title: {
      type: String,
      default: 'Sección',
    },
  },
}
</script>

<style scoped>
.settings-section {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
