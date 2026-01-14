<template>
  <v-container class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Benvingut/da!</h1>
        <p class="text-grey-700">Gestiona les sol·licituds de tallers del teu centre</p>
      </v-col>
    </v-row>

    <!-- Quick Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-item>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-700 mb-1">Tallers disponibles</p>
                <p class="text-h4 font-weight-bold">{{ workshops.length }}</p>
              </div>
              <div class="icon-stat primary">
                <v-icon size="28">mdi-book-open</v-icon>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-item>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-700 mb-1">Peticions pendents</p>
                <p class="text-h4 font-weight-bold">{{ pendingRequests }}</p>
              </div>
              <div class="icon-stat warning">
                <v-icon size="28">mdi-clock</v-icon>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-item>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-700 mb-1">Tallers assignats</p>
                <p class="text-h4 font-weight-bold">{{ assignedRequests }}</p>
              </div>
              <div class="icon-stat success">
                <v-icon size="28">mdi-check-circle</v-icon>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-item>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-700 mb-1">Checklist pendent</p>
                <p class="text-h4 font-weight-bold">2/4</p>
              </div>
              <div class="icon-stat info">
                <v-icon size="28">mdi-checkbox-marked</v-icon>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="action-card">
          <v-card-item>
            <div class="d-flex align-center gap-3 mb-4">
              <v-icon size="28" color="primary">mdi-book-open</v-icon>
              <div>
                <v-card-title class="pa-0">Catàleg de Tallers</v-card-title>
                <v-card-subtitle class="pa-0">Explora els tallers disponibles</v-card-subtitle>
              </div>
            </div>
          </v-card-item>
          <v-card-actions>
            <v-btn color="primary" @click="$router.push('/centre/cataleg')">
              Explorar
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="action-card">
          <v-card-item>
            <div class="d-flex align-center gap-3 mb-4">
              <v-icon size="28" color="secondary">mdi-file-document</v-icon>
              <div>
                <v-card-title class="pa-0">Les meves Peticions</v-card-title>
                <v-card-subtitle class="pa-0">Consulta l'estat de les teves sol·licituds</v-card-subtitle>
              </div>
            </div>
          </v-card-item>
          <v-card-actions>
            <v-btn color="secondary" @click="$router.push('/centre/peticions')">
              Consultar
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Requests -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center gap-2">
            <v-icon>mdi-history</v-icon>
            Peticions Recents
          </v-card-title>
          <v-data-table
            :headers="requestHeaders"
            :items="requests"
            class="elevation-0"
          >
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                text-color="white"
                size="small"
              >
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const workshops = ref([
  { id: 1, name: 'Robòtica Bàsica', description: 'Arduino' },
  { id: 2, name: 'Programació Web', description: 'HTML, CSS, JS' },
  { id: 3, name: 'Impressió 3D', description: 'Disseny i impressió' },
])

const requests = ref([
  {
    id: 1,
    centerName: 'Institut Montserrat',
    modality: 'A',
    estimatedStudents: 25,
    status: 'Pendent',
    date: '2024-01-08',
  },
  {
    id: 2,
    centerName: 'Institut Montserrat',
    modality: 'B',
    estimatedStudents: 30,
    status: 'Assignat',
    date: '2024-01-07',
  },
])

const requestHeaders = [
  { title: 'Centre', key: 'centerName' },
  { title: 'Modalitat', key: 'modality' },
  { title: 'Alumnes', key: 'estimatedStudents' },
  { title: 'Estat', key: 'status' },
  { title: 'Data', key: 'date' },
]

const pendingRequests = computed(() => requests.value.filter(r => r.status === 'Pendent').length)
const assignedRequests = computed(() => requests.value.filter(r => r.status === 'Assignat').length)

const getStatusColor = (status) => {
  const colors = {
    'Pendent': 'warning',
    'Assignat': 'success',
    'Rebutjat': 'error',
  }
  return colors[status] || 'default'
}
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-stat {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-stat.primary {
  background: rgba(31, 113, 184, 0.1);
  color: #1f71b8;
}

.icon-stat.warning {
  background: rgba(251, 140, 0, 0.1);
  color: #fb8c00;
}

.icon-stat.success {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.icon-stat.info {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.action-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.action-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
</style>
