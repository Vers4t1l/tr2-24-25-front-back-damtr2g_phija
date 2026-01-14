<template>
  <div class="home-view">
    <!-- Hero Section -->
    <div class="hero-section">
      <v-container>
        <v-row class="align-center min-vh-100">
          <v-col cols="12" md="6" class="text-center text-md-left">
            <h1 class="display-1 font-weight-bold mb-4">
              Gestió de
              <span class="gradient-text">Tallers Educatius</span>
            </h1>
            <p class="text-h6 text-grey-700 mb-6">
              Plataforma integral per sol·licitar, coordinar i avaluar tallers educatius
              del programa ENGINY del Consorci.
            </p>

            <!-- Features -->
            <div class="d-flex flex-column gap-3 mb-8">
              <div class="d-flex align-center gap-2">
                <v-icon color="primary" size="small">mdi-book-open</v-icon>
                <span>Catàleg de tallers</span>
              </div>
              <div class="d-flex align-center gap-2">
                <v-icon color="secondary" size="small">mdi-check-circle</v-icon>
                <span>Assignació automàtica</span>
              </div>
              <div class="d-flex align-center gap-2">
                <v-icon color="info" size="small">mdi-chart-bar</v-icon>
                <span>Informes detallats</span>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-img
              src="https://via.placeholder.com/500x400?text=ENGINY+Hub"
              alt="ENGINY Hub"
              class="rounded-lg"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Role Selection Cards -->
    <v-container class="py-16">
      <v-row class="mb-8">
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold text-center mb-2">Selecciona el teu rol</h2>
          <p class="text-center text-grey-700">Accedeix a la plataforma segons la teva funció</p>
        </v-col>
      </v-row>

      <v-row>
        <!-- Center Card -->
        <v-col cols="12" md="4" class="mb-6">
          <v-card
            class="role-card h-100 cursor-pointer transition-all"
            @click="selectRole('center')"
            :class="{ 'role-card-hover': true }"
          >
            <v-card-item class="pt-6">
              <div class="icon-box primary-box mb-4">
                <v-icon size="32" color="white">mdi-school</v-icon>
              </div>
              <v-card-title>Centre Educatiu</v-card-title>
              <v-card-subtitle>
                Sol·licita tallers per als teus alumnes i gestiona les peticions
              </v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <ul class="feature-list">
                <li class="d-flex align-center gap-2 mb-2">
                  <v-icon size="small" color="success">mdi-check-circle</v-icon>
                  <span>Explora el catàleg de tallers</span>
                </li>
                <li class="d-flex align-center gap-2 mb-2">
                  <v-icon size="small" color="success">mdi-check-circle</v-icon>
                  <span>Fes peticions de places</span>
                </li>
                <li class="d-flex align-center gap-2">
                  <v-icon size="small" color="success">mdi-check-circle</v-icon>
                  <span>Completa el checklist final</span>
                </li>
              </ul>
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" block @click="selectRole('center')">
                Accedir
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Admin Card -->
        <v-col cols="12" md="4" class="mb-6">
          <v-card
            class="role-card h-100 cursor-pointer transition-all"
            @click="selectRole('admin')"
            :class="{ 'role-card-hover': true }"
          >
            <v-card-item class="pt-6">
              <div class="icon-box secondary-box mb-4">
                <v-icon size="32" color="white">mdi-cog</v-icon>
              </div>
              <v-card-title>Administració</v-card-title>
              <v-card-subtitle>
                Gestiona tallers, peticions i assignacions del programa
              </v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <ul class="feature-list">
                <li class="d-flex align-center gap-2 mb-2">
                  <v-icon size="small" color="success">mdi-check-circle</v-icon>
                  <span>Gestiona el catàleg de tallers</span>
                </li>
                <li class="d-flex align-center gap-2 mb-2">
                  <v-icon size="small" color="success">mdi-check-circle</v-icon>
                  <span>Processa i assigna peticions</span>
                </li>
                <li class="d-flex align-center gap-2">
                  <v-icon size="small" color="success">mdi-check-circle</v-icon>
                  <span>Consulta informes i mètriques</span>
                </li>
              </ul>
            </v-card-text>

            <v-card-actions>
              <v-btn color="secondary" block @click="selectRole('admin')">
                Accedir
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Professor Card -->
        <v-col cols="12" md="4" class="mb-6">
          <v-card
            class="role-card h-100 cursor-pointer transition-all"
            @click="selectRole('professor')"
            :class="{ 'role-card-hover': true }"
          >
            <v-card-item class="pt-6">
              <div class="icon-box accent-box mb-4">
                <v-icon size="32" color="white">mdi-account-tie</v-icon>
              </div>
              <v-card-title>Professor/a</v-card-title>
              <v-card-subtitle>
                Consulta els tallers on ets referent i les notificacions
              </v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <ul class="feature-list">
                <li class="d-flex align-center gap-2 mb-2">
                  <v-icon size="small" color="success">mdi-check-circle</v-icon>
                  <span>Consulta tallers assignats</span>
                </li>
                <li class="d-flex align-center gap-2 mb-2">
                  <v-icon size="small" color="success">mdi-check-circle</v-icon>
                  <span>Rep notificacions automàtiques</span>
                </li>
                <li class="d-flex align-center gap-2">
                  <v-icon size="small" color="success">mdi-check-circle</v-icon>
                  <span>Accedeix a la informació</span>
                </li>
              </ul>
            </v-card-text>

            <v-card-actions>
              <v-btn color="info" block @click="selectRole('professor')">
                Accedir
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Stats Section -->
    <div class="stats-section bg-primary text-white py-12">
      <v-container>
        <v-row>
          <v-col cols="6" md="3" class="text-center">
            <div class="text-h3 font-weight-bold">24</div>
            <div class="text-subtitle2">Tallers disponibles</div>
          </v-col>
          <v-col cols="6" md="3" class="text-center">
            <div class="text-h3 font-weight-bold">156</div>
            <div class="text-subtitle2">Centres participants</div>
          </v-col>
          <v-col cols="6" md="3" class="text-center">
            <div class="text-h3 font-weight-bold">3.2k</div>
            <div class="text-subtitle2">Alumnes beneficiats</div>
          </v-col>
          <v-col cols="6" md="3" class="text-center">
            <div class="text-h3 font-weight-bold">98%</div>
            <div class="text-subtitle2">Satisfacció</div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Footer -->
    <v-footer class="bg-surface border-t pa-6">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center text-grey-700">
            <p class="mb-0">© 2024 ENGINY - Consorci d'Educació. Tots els drets reservats.</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'

const router = useRouter()
const appStore = useAppStore()

const selectRole = (role) => {
  const roleNames = {
    center: 'Institut Montserrat',
    admin: 'Administrador',
    professor: 'Professor/a',
  }
  
  appStore.login(role, roleNames[role])
  
  const routes = {
    center: '/centre',
    admin: '/admin',
    professor: '/professor',
  }
  
  router.push(routes[role])
}
</script>

<style scoped>
.home-view {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.role-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.role-card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.icon-box {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-box {
  background: linear-gradient(135deg, #1f71b8, #26a69a);
}

.secondary-box {
  background: linear-gradient(135deg, #26a69a, #1f71b8);
}

.accent-box {
  background: linear-gradient(135deg, #1f71b8, #667eea);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stats-section {
  background: linear-gradient(135deg, #1f71b8, #26a69a);
}

.cursor-pointer {
  cursor: pointer;
}

.transition-all {
  transition: all 0.3s ease;
}
</style>
