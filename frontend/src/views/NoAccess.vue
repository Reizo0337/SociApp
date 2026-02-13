<template>
  <div class="no-access-container">
    <div class="no-access-card">
      <h1>Acceso limitado</h1>
      <p>
        Estás logueado, pero tu usuario no tiene permisos de administrador.
        De momento, no puedes ver el resto de la aplicación.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.no-access-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-secondary);
  transition: background-color 0.3s ease;
}

.no-access-card {
  background: var(--card-bg);
  padding: 2rem 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--card-shadow);
  max-width: 600px;
  text-align: center;
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.no-access-card h1 {
  margin-bottom: 1rem;
  font-size: 1.8rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.no-access-card p {
  font-size: 1rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}
</style>

