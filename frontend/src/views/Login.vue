<template>
  <div class="login-container">
    <form @submit.prevent="submit" class="login-form">
      <h2>Iniciar sesión</h2>
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();

const submit = async () => {
  try {
    await auth.login({ email: email.value, password: password.value });

    // Si es administrador, puede ver la página entera
    if (auth.isAdmin) {
      router.push({ name: 'home' });
    } else {
      // Si no es administrador, sólo verá el texto de acceso limitado
      router.push({ name: 'no-access' });
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert(err?.response?.data?.message || 'Error al iniciar sesión');
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--bg-secondary);
  transition: background-color 0.3s ease;
}

.login-form {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px var(--card-shadow);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.login-form input {
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.login-form input:focus {
  outline: none;
  border-color: var(--button-primary);
  box-shadow: 0 0 0 2px rgba(42, 78, 162, 0.2);
}

.login-form input::placeholder {
  color: var(--text-tertiary);
}

.login-form button {
  padding: 0.75rem;
  font-size: 1rem;
  background: var(--button-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.login-form button:hover {
  background: var(--button-primary-hover);
}
</style>
