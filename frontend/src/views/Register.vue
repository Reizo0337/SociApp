<template>
  <div class="register-container">
    <form @submit.prevent="submit" class="register-form">
      <h2>Registro de Usuario</h2>

      <input v-model="form.nombre" placeholder="Nombre" required />
      <input v-model="form.apellidos" placeholder="Apellidos" required />
      <input v-model="form.email" placeholder="Email" type="email" required />
      <input v-model="form.password" placeholder="Contraseña" type="password" required />
      <input v-model="form.dni" placeholder="DNI" required />
      <input v-model="form.direccion" placeholder="Dirección" />
      <input v-model="form.CP" placeholder="CP" />
      <input v-model="form.provincia" placeholder="Provincia" />
      <input v-model="form.poblacion" placeholder="Población" />
      <input v-model="form.pais" placeholder="País" />
      <input v-model="form.telefono" placeholder="Teléfono" />
      <input v-model="form.fechaalta" placeholder="Fecha de alta" type="date" />
      <input v-model="form.formadepago" placeholder="Forma de pago" />
      <input v-model.number="form.cuota" placeholder="Cuota" type="number" />

      <select v-model="form.categoria">
        <option value="usuario">Usuario</option>
        <option value="monitor">Monitor</option>
      </select>

      <select v-model="form.socio">
        <option value="NoSocio">No Socio</option>
        <option value="Socio">Socio</option>
      </select>

      <button type="submit">Registrarse</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();

const form = reactive({
  nombre: '',
  apellidos: '',
  password: '',
  dni: '',
  direccion: '',
  CP: '',
  provincia: '',
  poblacion: '',
  pais: '',
  email: '',
  telefono: '',
  fechaalta: new Date().toISOString().substring(0,10),
  formadepago: '',
  cuota: 0,
  categoria: 'usuario',
  socio: 'NoSocio'
});

const submit = async () => {
  try {
    await auth.register(form);
    alert('Usuario registrado correctamente');
  } catch (err) {
    console.error(err);
    alert('Error al registrar usuario');
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--bg-secondary);
  transition: background-color 0.3s ease;
}

.register-form {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px var(--card-shadow);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.register-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.register-form input,
.register-form select {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.register-form input:focus,
.register-form select:focus {
  outline: none;
  border-color: var(--button-primary);
  box-shadow: 0 0 0 2px rgba(42, 78, 162, 0.2);
}

.register-form input::placeholder {
  color: var(--text-tertiary);
}

.register-form button {
  padding: 0.75rem;
  font-size: 1rem;
  background: var(--button-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.register-form button:hover {
  background: var(--button-primary-hover);
}
</style>
