<template>
  <div class="landing-container">
    <div class="landing-content">
      <div class="hero-section">
        <h1>Bienvenido a Sociapp</h1>
        <p class="subtitle">La plataforma integral para la gestión de tu asociación.</p>
        
        <div class="features-grid">
          <div class="feature-card">
            <span class="material-symbols-outlined">group</span>
            <h3>Gestión de Usuarios</h3>
            <p>Administra socios y usuarios de forma eficiente.</p>
          </div>
          <div class="feature-card">
            <span class="material-symbols-outlined">event</span>
            <h3>Actividades</h3>
            <p>Organiza y planifica eventos y actividades.</p>
          </div>
          <div class="feature-card">
            <span class="material-symbols-outlined">work</span>
            <h3>Proyectos</h3>
            <p>Control total sobre tus proyectos en curso.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Landing page logic if needed
</script>

<style scoped>
.landing-container {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  padding-top: 60px; /* Space for fixed header */
}

.landing-content {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  max-width: 1200px;
  width: 100%;
}

h1 {
  font-size: 3.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--button-primary) 0%, #63c2de 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.feature-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--card-shadow);
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px var(--card-shadow-hover);
}

.feature-card .material-symbols-outlined {
  font-size: 3rem;
  color: var(--button-primary);
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
}
</style>
