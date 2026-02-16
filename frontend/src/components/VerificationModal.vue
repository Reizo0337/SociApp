<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content verification-modal">
      <button class="close-btn" @click="$emit('close')">
        <span class="material-symbols-outlined">close</span>
      </button>

      <div class="form-container">
        <div class="icon-header">
          <span class="material-symbols-outlined">mark_email_read</span>
        </div>
        <h2>Verifica tu Correo</h2>
        <p class="description">
          Hemos enviado un código de 6 dígitos a <strong>{{ email }}</strong>. 
          Introduce el código para activar tu cuenta.
        </p>

        <form @submit.prevent="handleVerify">
          <div class="code-container">
            <input 
              v-for="(n, index) in 6" 
              :key="index"
              :ref="(el) => inputs[index] = el"
              v-model="codeDigits[index]"
              type="text"
              maxlength="1"
              class="code-input"
              @input="onInput($event, index)"
              @keydown.backspace="onBackspace($event, index)"
              required
            />
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Verificando...' : 'Verificar Cuenta' }}
          </button>
        </form>

        <div class="resend-container">
          <p v-if="resendTimer > 0">
            Puedes reenviar el código en {{ resendTimer }}s
          </p>
          <a v-else href="#" @click.prevent="handleResend" :class="{ disabled: isLoading }">
            ¿No has recibido el código? Reenviar
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';

const props = defineProps({
  email: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close', 'verified']);

const auth = useAuthStore();
const notificationStore = useNotificationStore();
const isLoading = ref(false);
const resendTimer = ref(60);
const codeDigits = reactive(['', '', '', '', '', '']);
const inputs = reactive([]);

let timerInterval;

onMounted(() => {
  startTimer();
  // Focus first input
  setTimeout(() => {
    if (inputs[0]) inputs[0].focus();
  }, 100);
});

onUnmounted(() => {
  clearInterval(timerInterval);
});

const startTimer = () => {
  resendTimer.value = 60;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

const onInput = (e, index) => {
  const val = e.target.value;
  // Solo permitir números
  if (val && !/^\d+$/.test(val)) {
    codeDigits[index] = '';
    return;
  }

  if (val && index < 5) {
    inputs[index + 1].focus();
  }
};

const onBackspace = (e, index) => {
  if (!codeDigits[index] && index > 0) {
    inputs[index - 1].focus();
  }
};

const handleVerify = async () => {
  const fullCode = codeDigits.join('');
  if (fullCode.length !== 6) {
    notificationStore.warning('Por favor, introduce el código de 6 dígitos.');
    return;
  }

  isLoading.value = true;
  try {
    console.log('Attempting verification with code:', fullCode);
    await auth.verifyEmail(props.email, fullCode);
    notificationStore.success('¡Correo verificado con éxito! Redirigiendo...');
    
    // Esperamos un poco para que el usuario vea el mensaje antes de cerrar
    setTimeout(() => {
      emit('verified');
      emit('close'); // Asegurarnos de cerrar todo
    }, 1500);
  } catch (err) {
    console.error('Verification error details:', err.response?.data);
    const errorMsg = err.response?.data?.message || 'Error al verificar el código';
    notificationStore.error(errorMsg);
    
    if (errorMsg.includes('eliminado')) {
      setTimeout(() => {
        emit('close');
      }, 2000);
    }
  } finally {
    isLoading.value = false;
  }
};

const handleResend = async () => {
  if (resendTimer.value > 0 || isLoading.value) return;
  
  try {
    await auth.resendCode(props.email);
    notificationStore.success('Código reenviado. Revisa tu bandeja de entrada.');
    startTimer();
  } catch (err) {
    notificationStore.error('Error al reenviar el código');
  }
};
</script>

<style scoped>
.modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
}

.verification-modal {
  max-width: 450px !important;
  padding: 2.5rem !important;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1a1a1a;
  transform: rotate(90deg) scale(1.1);
}

.icon-header {
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.icon-header span {
  font-size: 5rem;
  background: linear-gradient(135deg, var(--button-primary, #20a8d8), #63c2de);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.description {
  color: #666;
  margin-bottom: 2.5rem;
  font-size: 1rem;
  line-height: 1.6;
}

.description strong {
  color: var(--button-primary);
}

.code-container {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.code-input {
  width: 50px;
  height: 65px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  color: #1a1a1a;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.code-input:focus {
  border-color: var(--button-primary);
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(32, 168, 216, 0.2);
  outline: none;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--button-primary, #20a8d8), #1d90ba);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(32, 168, 216, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(32, 168, 216, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.resend-container {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.resend-container p {
  color: #888;
  font-size: 0.9rem;
}

.resend-container a {
  color: var(--button-primary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s;
}

.resend-container a:hover {
  filter: brightness(1.2);
}

.resend-container a.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
