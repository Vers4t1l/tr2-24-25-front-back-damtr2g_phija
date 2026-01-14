<template>
  <div class="verification-container">
    <!-- FULL SCREEN BACKGROUND -->
    <div class="animated-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- CENTERED CARD -->
    <v-container fluid class="fill-height pa-0">
      <v-row class="align-center justify-center h-100 ma-0">
        <v-col cols="12" class="d-flex justify-center px-4">
          <!-- Pending Verification State -->
          <v-card v-if="verificationStep === 'pending'" class="verification-card" elevation="20">
            <!-- Header -->
            <div class="verification-header">
              <div class="logo-box-large">
                <v-icon size="72" color="white" class="pulse-icon">mdi-email-check</v-icon>
              </div>
              <h1 class="text-h3 font-weight-bold mt-6 text-white">Verifica el teu Correu</h1>
              <p class="text-subtitle1 text-grey-200">Confirma la teva adreça de correu</p>
              <div class="header-divider"></div>
            </div>

            <!-- Form Section -->
            <v-card-text class="pa-8">
              <p class="text-center text-grey-700 mb-6">
                Hem enviat un codi de confirmació a:
                <br />
                <strong>{{ email }}</strong>
              </p>

              <!-- Verification Code Input -->
              <v-text-field
                v-model="verificationCode"
                label="Codi de Confirmació"
                placeholder="Introdueix el codi de 6 dígits"
                prepend-inner-icon="mdi-key"
                outlined
                dense
                class="mb-6"
                maxlength="6"
                uppercase
                :rules="[v => !!v || 'El codi és obligatori']"
                color="primary"
                variant="outlined"
                :disabled="isLoading"
              ></v-text-field>

              <!-- Error Message -->
              <v-alert
                v-if="errorMessage"
                type="error"
                outlined
                class="mb-6"
                closable
                @click:close="errorMessage = ''"
                icon="mdi-alert-circle"
              >
                {{ errorMessage }}
              </v-alert>

              <!-- Verify Button -->
              <v-btn
                color="primary"
                block
                size="large"
                @click="handleVerification"
                :loading="isLoading"
                :disabled="isLoading || verificationCode.length !== 6"
                class="mb-4 verify-btn"
              >
                <v-icon left>mdi-check-circle</v-icon>
                Verificar Correu
              </v-btn>

              <!-- Resend Code -->
              <div class="text-center">
                <p class="text-caption text-grey-600 mb-2">
                  No has rebut el codi?
                  <a href="#" class="text-primary font-weight-bold" @click.prevent="handleResendCode">
                    Reenviar
                  </a>
                </p>
              </div>

              <!-- Info Box -->
              <v-card class="mt-6 info-card" variant="outlined">
                <v-card-text class="pa-3">
                  <div class="d-flex gap-2">
                    <v-icon color="info" size="small">mdi-information</v-icon>
                    <p class="text-caption">
                      El codi expira en 15 minuts. Si no el veus, revisa la carpeta de correu brossa.
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>

          <!-- Success State -->
          <v-card v-else-if="verificationStep === 'success'" class="verification-card success-card" elevation="20">
            <div class="success-container">
              <div class="success-icon">
                <v-icon size="120" color="success">mdi-check-circle</v-icon>
              </div>
              <h2 class="text-h4 font-weight-bold text-center mt-6 mb-2">¡Correu Verificat!</h2>
              <p class="text-center text-grey-600 mb-8">
                El teu compte ha estat creat correctament. Ja pots iniciar sessió.
              </p>

              <v-btn
                color="primary"
                block
                size="large"
                @click="redirectToLogin"
                class="login-btn"
              >
                <v-icon left>mdi-login</v-icon>
                Anar al Login
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const email = ref('')
const verificationCode = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const verificationStep = ref('pending') // 'pending' | 'success'

onMounted(() => {
  // Get email from query params
  email.value = route.query.email || ''

  // If no email, redirect to register
  if (!email.value) {
    router.push('/register')
  }
})

// Handle verification
const handleVerification = async () => {
  if (verificationCode.value.length !== 6) {
    errorMessage.value = 'El codi ha de tenir 6 caràcters'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Call backend API
    const response = await api.verifyEmail(email.value, verificationCode.value)

    if (!response.success) {
      errorMessage.value = response.message || 'Error en la verificació'
      isLoading.value = false
      return
    }

    // Show success state
    verificationStep.value = 'success'
  } catch (error) {
    errorMessage.value = error.message || 'Error en la verificació'
    isLoading.value = false
  }
}

// Handle resend code
const handleResendCode = async () => {
  isLoading.value = true

  try {
    // Call backend API
    const response = await api.resendCode(email.value)

    if (!response.success) {
      errorMessage.value = response.message || 'Error en l\'enviament del codi'
      isLoading.value = false
      return
    }

    errorMessage.value = ''
    verificationCode.value = ''
    isLoading.value = false

    // Show success notification
    alert('✅ Codi reenviado. Revisa el teu correu electrònic.')
  } catch (error) {
    errorMessage.value = error.message || 'Error en l\'enviament del codi'
    isLoading.value = false
  }
}

// Redirect to login
const redirectToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.verification-container {
  background: linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #C41E3A 100%);
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.animated-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.blob-1 {
  width: 200px;
  height: 200px;
  background: white;
  top: -50px;
  right: -50px;
  animation-delay: 0s;
}

.blob-2 {
  width: 150px;
  height: 150px;
  background: #C41E3A;
  bottom: -30px;
  left: -30px;
  animation-delay: 2s;
}

.blob-3 {
  width: 100px;
  height: 100px;
  background: white;
  top: 50%;
  left: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(20px) translateX(10px);
  }
}

.verification-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

.success-card {
  background: white;
}

.verification-header {
  background: linear-gradient(135deg, #C41E3A 0%, #8B0000 100%);
  color: white;
  padding: 50px 20px 40px;
  text-align: center;
  position: relative;
}

.verification-header::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(135deg, #C41E3A 0%, #8B0000 100%);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 50%);
}

.logo-box-large {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.pulse-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.header-divider {
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  margin-top: 20px;
}

.verify-btn {
  background: linear-gradient(135deg, #C41E3A 0%, #8B0000 100%);
  color: white;
  font-weight: bold;
  transition: all 0.3s ease;
}

.verify-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(196, 30, 58, 0.3);
}

.info-card {
  background: rgba(52, 152, 219, 0.05);
  border: 2px solid rgba(52, 152, 219, 0.2);
  border-radius: 12px;
}

.success-container {
  padding: 60px 40px;
  text-align: center;
}

.success-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.login-btn {
  background: linear-gradient(135deg, #C41E3A 0%, #8B0000 100%);
  color: white;
  font-weight: bold;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(196, 30, 58, 0.3);
}

.h-100 {
  height: 100%;
}

.fill-height {
  height: 100%;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
