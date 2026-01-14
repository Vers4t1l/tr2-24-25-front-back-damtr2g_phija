<template>
  <div class="login-container">
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
          <v-card class="login-card" elevation="20">
            <!-- Logo Section with Animation -->
            <div class="login-header">
              <div class="logo-box-large">
                <v-icon size="72" color="white" class="pulse-icon">mdi-school</v-icon>
              </div>
              <h1 class="text-h3 font-weight-bold mt-6 text-white">ENGINY</h1>
              <p class="text-subtitle1 text-grey-200">Gestió de Tallers Educatius</p>
              <div class="header-divider"></div>
            </div>

            <!-- Form Section -->
            <v-card-text class="pa-8">
              <v-form @submit.prevent="handleLogin" ref="loginForm">
                <!-- Email Field -->
                <v-text-field
                  v-model="form.email"
                  label="Correu Electrònic"
                  type="email"
                  prepend-inner-icon="mdi-email"
                  outlined
                  dense
                  class="mb-6"
                  :rules="emailRules"
                  required
                  @keyup.enter="handleLogin"
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>

                <!-- Password Field -->
                <v-text-field
                  v-model="form.password"
                  label="Contrasenya"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  outlined
                  dense
                  class="mb-6"
                  :rules="passwordRules"
                  required
                  @click:append-inner="showPassword = !showPassword"
                  @keyup.enter="handleLogin"
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>

                <!-- Remember Me & Forgot Password -->
                <div class="d-flex justify-space-between align-center mb-6">
                  <v-checkbox
                    v-model="form.rememberMe"
                    label="Recorda'm"
                    color="primary"
                    density="compact"
                    :disabled="isLoading"
                  ></v-checkbox>
                  <a href="#" class="text-primary text-decoration-none text-caption">
                    He oblidat la contrasenya
                  </a>
                </div>

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

                <!-- Login Button -->
                <v-btn
                  color="primary"
                  block
                  size="large"
                  type="submit"
                  :loading="isLoading"
                  :disabled="isLoading"
                  class="mb-4 login-btn"
                >
                  <v-icon left>mdi-login</v-icon>
                  Iniciar Sessió
                </v-btn>

                <!-- Register Link -->
                <div class="text-center">
                  <p class="text-caption text-grey-600 mb-2">
                    No tens compte?
                    <router-link to="/register" class="text-primary font-weight-bold">
                      Crea'n un aquí
                    </router-link>
                  </p>
                </div>
              </v-form>

              <!-- Demo Info -->
              <v-divider class="my-6"></v-divider>

              <v-card class="demo-info-card" variant="outlined">
                <v-card-text class="pa-4">
                  <p class="text-caption font-weight-bold mb-3">📝 Compte de Demostració:</p>
                  <p class="text-caption mb-2">
                    <strong>Correu:</strong> demo@example.com<br />
                    <strong>Contrasenya:</strong> Demo1234
                  </p>
                  <v-btn
                    size="small"
                    variant="text"
                    color="primary"
                    @click="fillDemoCredentials"
                    :disabled="isLoading"
                    class="mt-2"
                  >
                    <v-icon left>mdi-auto-fix</v-icon>
                    Emplenar Automàticament
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-card-text>

            <!-- Footer -->
            <v-card-actions class="justify-center pa-4 border-t">
              <p class="text-caption text-grey-600">
                © 2024 ENGINY - Consorci d'Educació
              </p>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import api from '../services/api'

const router = useRouter()
const appStore = useAppStore()

const loginForm = ref(null)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = ref({
  email: '',
  password: '',
  rememberMe: false,
})

// Validation rules
const emailRules = [
  v => !!v || 'El correu és obligatori',
  v => /.+@.+\..+/.test(v) || 'El correu ha de ser vàlid',
]

const passwordRules = [
  v => !!v || 'La contrasenya és obligatòria',
  v => v.length >= 6 || 'La contrasenya ha de tenir almenys 6 caràcters',
]

// Fill demo credentials
const fillDemoCredentials = () => {
  form.value.email = 'demo@example.com'
  form.value.password = 'Demo1234'
}

// Handle login
const handleLogin = async () => {
  // Validate form
  const { valid } = await loginForm.value.validate()
  if (!valid) {
    errorMessage.value = 'Si us plau, completa tots els camps correctament'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Call backend API
    const response = await api.login(form.value.email, form.value.password)

    if (!response.success) {
      errorMessage.value = response.message || 'Error en l\'inici de sessió'
      isLoading.value = false
      return
    }

    // Save token and user
    api.saveToken(response.token, response.user)

    // Update app store
    appStore.login(response.user.role, response.user.fullName, response.token, response.user.email)

    // Redirect to appropriate dashboard
    const routes = {
      CENTER: '/centre',
      ADMIN: '/admin',
      PROFESSOR: '/professor',
    }

    router.push(routes[response.user.role])
  } catch (error) {
    errorMessage.value = error.message || 'Error en l\'inici de sessió'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
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

.login-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

.login-header {
  background: linear-gradient(135deg, #C41E3A 0%, #8B0000 100%);
  color: white;
  padding: 50px 20px 40px;
  text-align: center;
  position: relative;
}

.login-header::after {
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

.demo-info-card {
  background: rgba(196, 30, 58, 0.05);
  border: 2px solid rgba(196, 30, 58, 0.2);
  border-radius: 12px;
}

.h-100 {
  height: 100%;
}

.fill-height {
  height: 100%;
}

.border-t {
  border-top: 1px solid #E5E7EB;
}

.text-decoration-none {
  text-decoration: none;
}

.text-decoration-none:hover {
  text-decoration: underline;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
