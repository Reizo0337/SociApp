<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">
        <span class="material-symbols-outlined">close</span>
      </button>
      
      <div class="form-container">
        <h2>Iniciar sesión</h2>
        <form @submit.prevent="submit">
          <div class="input-group">
            <span class="material-symbols-outlined input-icon">email</span>
            <input v-model="email" type="email" placeholder="Email" required />
          </div>
          
          <div class="input-group">
            <span class="material-symbols-outlined input-icon">lock</span>
            <input v-model="password" type="password" placeholder="Contraseña" required />
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>

          <div class="auth-footer">
            <p>¿No tienes cuenta? <a href="#" @click.prevent="$emit('switch-to-register')">Regístrate</a></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const emit = defineEmits(['close', 'switch-to-register']);
const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();
const isLoading = ref(false);

const submit = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  
  try {
    await auth.login({ email: email.value, password: password.value });
    emit('close');
    
    // Redirect based on role
    if (auth.isAdmin) {
      router.push({ name: 'home' });
    }
    // If not admin, they stay on Landing but are logged in (header changes)
    
  } catch (err) {
    // Basic error handling
    alert(err?.response?.data?.message || 'Error al iniciar sesión');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--card-bg);
  padding: 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  border: 1px solid var(--border-color);
  animation: slideUp 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
  font-size: 1.8rem;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  font-size: 1.2rem;
}

input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: var(--button-primary);
  box-shadow: 0 0 0 3px rgba(32, 168, 216, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 0.9rem;
  background: var(--button-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: var(--button-primary-hover);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
}

.auth-footer p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.auth-footer a {
  color: var(--button-primary);
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
