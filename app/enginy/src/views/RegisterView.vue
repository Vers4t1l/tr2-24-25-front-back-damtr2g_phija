<template>
  <div class="register-container">
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
          <v-card class="register-card" elevation="20">
            <!-- Logo Section with Animation -->
            <div class="register-header">
              <div class="logo-box-large">
                <v-icon size="72" color="white" class="pulse-icon">mdi-account-plus</v-icon>
              </div>
              <h1 class="text-h3 font-weight-bold mt-6 text-white">ENGINY</h1>
              <p class="text-subtitle1 text-grey-200">Crear Compte</p>
              <div class="header-divider"></div>
            </div>

            <!-- Form Section -->
            <v-card-text class="pa-8">
              <v-form @submit.prevent="handleRegister" ref="registerForm">
                <!-- Full Name Field -->
                <v-text-field
                  v-model="form.fullName"
                  label="Nom Complet"
                  prepend-inner-icon="mdi-account"
                  outlined
                  dense
                  class="mb-6"
                  :rules="nameRules"
                  required
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>

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
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>

                <!-- Role Selection -->
                <v-select
                  v-model="form.role"
                  label="Selecciona el teu rol"
                  :items="roleOptions"
                  prepend-inner-icon="mdi-briefcase"
                  outlined
                  dense
                  class="mb-6"
                  :rules="[v => !!v || 'Has de seleccionar un rol']"
                  required
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-select>

                <!-- Organization Name (for Centers) -->
                <v-text-field
                  v-if="form.role === 'CENTER'"
                  v-model="form.organizationName"
                  label="Nom del Centre Educatiu"
                  prepend-inner-icon="mdi-school"
                  outlined
                  dense
                  class="mb-6"
                  :rules="[v => !!v || 'El nom del centre és obligatori']"
                  required
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>

                <!-- Organization Name (for Professors) -->
                <v-text-field
                  v-if="form.role === 'PROFESSOR'"
                  v-model="form.organizationName"
                  label="Centre de Treball"
                  prepend-inner-icon="mdi-school"
                  outlined
                  dense
                  class="mb-6"
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
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>

                <!-- Confirm Password Field -->
                <v-text-field
                  v-model="form.confirmPassword"
                  label="Confirma Contrasenya"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  outlined
                  dense
                  class="mb-6"
                  :rules="[
                    v => !!v || 'Has de confirmar la contrasenya',
                    v => v === form.password || 'Les contrasenyes no coincideixen'
                  ]"
                  required
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>

                <!-- Terms & Conditions -->
                <v-checkbox
                  v-model="form.acceptTerms"
                  class="mb-6"
                  color="primary"
                  :disabled="isLoading"
                >
                  <template v-slot:label>
                    <span class="text-caption">
                      Accepto els
                      <a href="#" class="text-primary">Termes i Condicions</a>
                    </span>
                  </template>
                </v-checkbox>

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

                <!-- Register Button -->
                <v-btn
                  color="primary"
                  block
                  size="large"
                  type="submit"
                  :loading="isLoading"
                  :disabled="isLoading || !form.acceptTerms"
                  class="mb-4 register-btn"
                >
                  <v-icon left>mdi-account-plus</v-icon>
                  Crear Compte
                </v-btn>

                <!-- Login Link -->
                <div class="text-center">
                  <p class="text-caption text-grey-600 mb-2">
                    Ja tens compte?
                    <router-link to="/login" class="text-primary font-weight-bold">
                      Inicia sessió aquí
                    </router-link>
                  </p>
                </div>
              </v-form>
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
import api from '../services/api'

const router = useRouter()

const registerForm = ref(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = ref({
  fullName: '',
  email: '',
  role: '',
  organizationName: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const roleOptions = [
  { title: '🏫 Centre Educatiu', value: 'CENTER' },
  { title: '👨‍🏫 Professor', value: 'PROFESSOR' },
]

// Validation rules
const nameRules = [
  v => !!v || 'El nom és obligatori',
  v => v.length >= 3 || 'El nom ha de tenir almenys 3 caràcters',
]

const emailRules = [
  v => !!v || 'El correu és obligatori',
  v => /.+@.+\..+/.test(v) || 'El correu ha de ser vàlid',
]

const passwordRules = [
  v => !!v || 'La contrasenya és obligatòria',
  v => v.length >= 8 || 'La contrasenya ha de tenir almenys 8 caràcters',
  v => /[A-Z]/.test(v) || 'Ha de contenir almenys una majúscula',
  v => /[0-9]/.test(v) || 'Ha de contenir almenys un número',
]

// Handle registration
const handleRegister = async () => {
  // Validate form
  const { valid } = await registerForm.value.validate()
  if (!valid) {
    errorMessage.value = 'Si us plau, completa tots els camps correctament'
    return
  }

  // Check if terms are accepted
  if (!form.value.acceptTerms) {
    errorMessage.value = 'Has d\'acceptar els Termes i Condicions'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Call backend API
    const response = await api.register(
      form.value.email,
      form.value.password,
      form.value.fullName,
      form.value.role,
      form.value.organizationName
    )

    if (!response.success) {
      errorMessage.value = response.message || 'Error en el registre'
      isLoading.value = false
      return
    }

    // Redirect to email verification page
    router.push({
      name: 'EmailVerification',
      query: { email: form.value.email },
    })
  } catch (error) {
    errorMessage.value = error.message || 'Error en el registre'
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
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

.register-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

.register-header {
  background: linear-gradient(135deg, #C41E3A 0%, #8B0000 100%);
  color: white;
  padding: 50px 20px 40px;
  text-align: center;
  position: relative;
}

.register-header::after {
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

.register-btn {
  background: linear-gradient(135deg, #C41E3A 0%, #8B0000 100%);
  color: white;
  font-weight: bold;
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(196, 30, 58, 0.3);
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

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
