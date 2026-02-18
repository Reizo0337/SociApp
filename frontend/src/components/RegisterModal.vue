<template>
  <div 
    class="modal-overlay" 
    @mousedown.self="isBackdropClick = true" 
    @mouseup.self="isBackdropClick && $emit('close'); isBackdropClick = false"
    @mouseup="isBackdropClick = false"
  >
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">
        <span class="material-symbols-outlined">close</span>
      </button>
      
      <div class="form-container">
        <h2>Crear Cuenta</h2>
        
        <form @submit.prevent="submit" class="register-grid">
          <!-- Paso 1: Datos Personales -->
          <div class="form-section">
            <div class="input-group">
              <input v-model="form.nombre" placeholder="Nombre" required />
            </div>
            <div class="input-group">
              <input v-model="form.apellidos" placeholder="Apellidos" required />
            </div>
          </div>

          <div class="form-section">
            <div class="input-group">
               <input v-model="form.dni" placeholder="DNI" required />
            </div>
             <div class="input-group">
              <input v-model="form.telefono" placeholder="Teléfono" required />
            </div>
          </div>

           <div class="input-group full-width">
            <input v-model="form.email" placeholder="Email" type="email" required />
          </div>
          
          <div class="input-group full-width">
            <input v-model="form.password" placeholder="Contraseña" type="password" required />
          </div>

          <!-- Paso 2: Dirección -->
          <div class="input-group full-width">
             <input v-model="form.direccion" placeholder="Dirección" />
          </div>

          <div class="form-section">
            <div class="input-group">
              <input v-model="form.poblacion" placeholder="Población" />
            </div>
            <div class="input-group">
              <input v-model="form.provincia" placeholder="Provincia" />
            </div>
          </div>

          <div class="form-section">
             <div class="input-group">
              <input v-model="form.CP" placeholder="Código Postal" />
            </div>
            <div class="input-group">
              <input v-model="form.pais" placeholder="País" />
            </div>
          </div>

          <div class="form-section">
            <div class="input-group">
              <select v-model="form.socio" class="full-width-select">
                <option value="NoSocio">No Socio</option>
                <option value="Socio">Socio</option>
              </select>
            </div>
            <div class="input-group">
               <input v-model="form.formadepago" placeholder="Forma de pago" />
            </div>
          </div>

          <div class="input-group full-width" v-if="form.socio === 'Socio'">
             <input v-model.number="form.cuota" placeholder="Cuota" type="number" />
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Registrando...' : 'Registrarse' }}
          </button>

          <div class="auth-footer">
            <p>¿Ya tienes cuenta? <a href="#" @click.prevent="$emit('switch-to-login')">Inicia sesión</a></p>
          </div>
        </form>
      </div>

      <VerificationModal 
        v-if="showVerification"
        :email="form.email"
        @close="showVerification = false"
        @verified="onVerified"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import VerificationModal from './VerificationModal.vue';

const emit = defineEmits(['close', 'switch-to-login']);
const auth = useAuthStore();
const notificationStore = useNotificationStore();
const isLoading = ref(false);
const showVerification = ref(false);
const isBackdropClick = ref(false);

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
  fechaalta: '',
  formadepago: '',
  cuota: 0,
  categoria: 'usuario',
  socio: 'NoSocio'
});

const submit = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  
  try {
    // Ensure all required fields have proper values
    const payload = {
      nombre: form.nombre || '',
      apellidos: form.apellidos || '',
      password: form.password || '',
      dni: form.dni || '',
      direccion: form.direccion || '',
      CP: form.CP || '',
      provincia: form.provincia || '',
      poblacion: form.poblacion || '',
      pais: form.pais || '',
      email: form.email || '',
      telefono: form.telefono || '',
      fechaalta: new Date().toISOString(),
      formadepago: form.formadepago || '',
      cuota: Number(form.cuota) || 0,
      categoria: form.categoria || 'usuario',
      socio: form.socio || 'NoSocio'
    };
    
    console.log('Payload being sent:', payload);
    console.log('fechaalta value:', payload.fechaalta);
    console.log('fechaalta type:', typeof payload.fechaalta);
    
    await auth.register(payload);
    notificationStore.success('Usuario registrado. Se ha enviado un código de verificación.');
    showVerification.value = true;
  } catch (err) {
    console.error('Registration error:', err);
    console.error('Error response:', err?.response?.data);
    notificationStore.error('Error al registrar usuario: ' + (err?.response?.data?.message || 'Inténtelo de nuevo'));
  } finally {
    isLoading.value = false;
  }
};

const onVerified = () => {
  showVerification.value = false;
  emit('switch-to-login');
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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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

.register-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: var(--button-primary);
  box-shadow: 0 0 0 3px rgba(32, 168, 216, 0.1);
}

.full-width {
  width: 100%;
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
  margin-top: 1rem;
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

@media (max-width: 500px) {
  .form-section {
    grid-template-columns: 1fr;
  }
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
