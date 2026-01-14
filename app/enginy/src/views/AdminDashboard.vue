<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">Dashboard d'Administració</h1>
      <p class="text-subtitle1 text-grey-600">Benvingut, {{ appStore.userName }}. Aquí trobaràs un resum de l'estat del sistema.</p>
    </div>

    <!-- Key Metrics with Red Theme -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3">
        <v-card class="metric-card elevation-2" color="primary">
          <v-card-text class="text-white pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-caption opacity-75">Tallers Actius</p>
                <p class="text-h4 font-weight-bold">24</p>
              </div>
              <v-icon size="48" class="opacity-50">mdi-book-open</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="metric-card elevation-2" color="success">
          <v-card-text class="text-white pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-caption opacity-75">Peticions Processades</p>
                <p class="text-h4 font-weight-bold">156</p>
              </div>
              <v-icon size="48" class="opacity-50">mdi-check-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="metric-card elevation-2" color="warning">
          <v-card-text class="text-white pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-caption opacity-75">Peticions Pendents</p>
                <p class="text-h4 font-weight-bold">12</p>
              </div>
              <v-icon size="48" class="opacity-50">mdi-clock</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="metric-card elevation-2" color="info">
          <v-card-text class="text-white pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-caption opacity-75">Professors Disponibles</p>
                <p class="text-h4 font-weight-bold">18</p>
              </div>
              <v-icon size="48" class="opacity-50">mdi-account-multiple</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts & Analytics -->
    <v-row class="mb-8">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center gap-2">
            <v-icon color="primary">mdi-chart-pie</v-icon>
            Distribució de Tallers per Modalitat
          </v-card-title>
          <v-card-text>
            <div class="chart-container">
              <div class="chart-bar">
                <div class="chart-label">Modalitat A</div>
                <div class="bar-container">
                  <div class="bar" style="width: 65%; background: linear-gradient(90deg, #C41E3A, #DC143C);">
                    <span class="bar-text">65%</span>
                  </div>
                </div>
              </div>
              <div class="chart-bar">
                <div class="chart-label">Modalitat B</div>
                <div class="bar-container">
                  <div class="bar" style="width: 25%; background: linear-gradient(90deg, #F39C12, #F8B739);">
                    <span class="bar-text">25%</span>
                  </div>
                </div>
              </div>
              <div class="chart-bar">
                <div class="chart-label">Modalitat C</div>
                <div class="bar-container">
                  <div class="bar" style="width: 10%; background: linear-gradient(90deg, #3498DB, #5DADE2);">
                    <span class="bar-text">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center gap-2">
            <v-icon color="success">mdi-trending-up</v-icon>
            Taxa de Satisfacció
          </v-card-title>
          <v-card-text>
            <div class="satisfaction-container">
              <div class="satisfaction-item">
                <div class="satisfaction-score">4.7</div>
                <div class="satisfaction-label">Puntuació General</div>
                <v-rating
                  v-model="rating"
                  readonly
                  color="warning"
                  length="5"
                  size="small"
                ></v-rating>
              </div>
              <div class="satisfaction-stats">
                <div class="stat-row">
                  <span>Tallers Completats:</span>
                  <strong>142</strong>
                </div>
                <div class="stat-row">
                  <span>Avaluacions Rebudes:</span>
                  <strong>138</strong>
                </div>
                <div class="stat-row">
                  <span>Taxa de Resposta:</span>
                  <strong>97%</strong>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activity -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center gap-2">
            <v-icon color="primary">mdi-history</v-icon>
            Activitat Recent
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <template v-slot:prepend>
                  <v-icon :color="activity.color">{{ activity.icon }}</v-icon>
                </template>
                <v-list-item-title class="font-weight-bold">{{ activity.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ activity.description }}</v-list-item-subtitle>
                <template v-slot:append>
                  <span class="text-caption text-grey-600">{{ activity.time }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Action Buttons -->
    <v-row class="mt-8">
      <v-col cols="12">
        <div class="d-flex gap-3 flex-wrap">
          <v-btn color="primary" size="large" @click="navigateTo('/admin/peticions')">
            <v-icon left>mdi-file-document</v-icon>
            Processar Peticions
          </v-btn>
          <v-btn color="secondary" size="large" @click="navigateTo('/admin/tallers')">
            <v-icon left>mdi-book-open</v-icon>
            Gestionar Tallers
          </v-btn>
          <v-btn color="accent" size="large" @click="navigateTo('/admin/informes')">
            <v-icon left>mdi-chart-bar</v-icon>
            Veure Informes
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'

const router = useRouter()
const appStore = useAppStore()

const rating = ref(4.7)

const recentActivities = [
  {
    id: 1,
    icon: 'mdi-check-circle',
    color: 'success',
    title: 'Petició Processada',
    description: 'Institut Montserrat ha rebut 3 tallers assignats',
    time: 'fa 2 hores',
  },
  {
    id: 2,
    icon: 'mdi-file-document',
    color: 'info',
    title: 'Checklist Completat',
    description: 'IES Jaume Balmes ha completat el checklist del taller "Robòtica"',
    time: 'fa 4 hores',
  },
  {
    id: 3,
    icon: 'mdi-account-plus',
    color: 'primary',
    title: 'Professor Afegit',
    description: 'Joan Martínez ha estat afegit com a professor referent',
    time: 'fa 1 dia',
  },
  {
    id: 4,
    icon: 'mdi-star',
    color: 'warning',
    title: 'Avaluació Rebuda',
    description: 'Puntuació de 4.8/5 per al taller "Programació Web"',
    time: 'fa 2 dies',
  },
]

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.metric-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-label {
  font-size: 12px;
  font-weight: bold;
  color: #2C3E50;
}

.bar-container {
  height: 30px;
  background: #ECF0F1;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.bar:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bar-text {
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.satisfaction-container {
  display: flex;
  gap: 40px;
  align-items: center;
}

.satisfaction-item {
  text-align: center;
  flex: 1;
}

.satisfaction-score {
  font-size: 48px;
  font-weight: bold;
  color: #C41E3A;
  margin-bottom: 8px;
}

.satisfaction-label {
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 12px;
}

.satisfaction-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #E5E7EB;
  font-size: 14px;
}

.stat-row strong {
  color: #C41E3A;
  font-weight: bold;
}

.activity-item {
  border-bottom: 1px solid #E5E7EB;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: rgba(196, 30, 58, 0.03);
}

.activity-item:last-child {
  border-bottom: none;
}
</style>
