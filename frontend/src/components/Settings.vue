<template>
  <div>
    <h2 class="title">Configuración</h2>

    <div class="cards">
      <div class="card green" @click="$emit('open', 'junta')">
        👥 Junta Directiva
      </div>

      <div class="card yellow" @click="$emit('open', 'organismos')">
        🏛️ Otros Organismos
      </div>

      <div class="card purple" @click="$emit('open', 'relaciones')">
        🤝 Relaciones Institucionales
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  padding: 30px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  font-size: 18px;
}

.blue { background: #28aadc; }
.green { background: #4caf50; }
.yellow { background: #ffc107; }
.teal { background: #26c6da; }
.purple { background: #7e57c2; }
.red { background: #ef5350; }
</style>
