<template>
  <v-container class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Els Meus Tallers</h1>
        <p class="text-grey-700">Consulta els tallers on ets referent i les notificacions</p>
      </v-col>
    </v-row>

    <!-- Quick Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-item>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-700 mb-1">Tallers Assignats</p>
                <p class="text-h4 font-weight-bold">{{ assignedWorkshops.length }}</p>
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
                <p class="text-caption text-grey-700 mb-1">Alumnes Totals</p>
                <p class="text-h4 font-weight-bold">{{ totalStudents }}</p>
              </div>
              <div class="icon-stat success">
                <v-icon size="28">mdi-account-multiple</v-icon>
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
                <p class="text-caption text-grey-700 mb-1">Centres</p>
                <p class="text-h4 font-weight-bold">{{ uniqueCentres }}</p>
              </div>
              <div class="icon-stat info">
                <v-icon size="28">mdi-school</v-icon>
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
                <p class="text-caption text-grey-700 mb-1">Notificacions</p>
                <p class="text-h4 font-weight-bold">{{ notifications.length }}</p>
              </div>
              <div class="icon-stat warning">
                <v-icon size="28">mdi-bell</v-icon>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Assigned Workshops -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center gap-2">
            <v-icon>mdi-book-open</v-icon>
            Els Meus Tallers Assignats
          </v-card-title>
          <v-data-table
            :headers="workshopHeaders"
            :items="assignedWorkshops"
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
            <template v-slot:item.actions="{ item }">
              <v-btn icon small @click="viewWorkshopDetails(item)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Notifications -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center gap-2">
            <v-icon>mdi-bell</v-icon>
            Notificacions
          </v-card-title>
          <v-list>
            <v-list-item v-for="notification in notifications" :key="notification.id">
              <template v-slot:prepend>
                <v-icon :color="notification.type === 'info' ? 'info' : 'success'">
                  {{ notification.type === 'info' ? 'mdi-information' : 'mdi-check-circle' }}
                </v-icon>
              </template>
              <v-list-item-title>{{ notification.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-chip size="small" color="grey-200">{{ notification.date }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Details Dialog -->
    <v-dialog v-model="showDetailsDialog" max-width="600px">
      <v-card v-if="selectedWorkshop">
        <v-card-title>{{ selectedWorkshop.name }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <p><strong>Centre:</strong> {{ selectedWorkshop.center }}</p>
              <p><strong>Modalitat:</strong> {{ selectedWorkshop.modality }}</p>
              <p><strong>Alumnes:</strong> {{ selectedWorkshop.students }}</p>
            </v-col>
            <v-col cols="12" md="6">
              <p><strong>Data de inici:</strong> {{ selectedWorkshop.startDate }}</p>
              <p><strong>Durada:</strong> {{ selectedWorkshop.duration }}</p>
              <p><strong>Estat:</strong> {{ selectedWorkshop.status }}</p>
            </v-col>
          </v-row>
          <v-divider class="my-4"></v-divider>
          <p><strong>Descripció:</strong></p>
          <p>{{ selectedWorkshop.description }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showDetailsDialog = false">Tancar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const showDetailsDialog = ref(false)
const selectedWorkshop = ref(null)

const workshopHeaders = [
  { title: 'Taller', key: 'name' },
  { title: 'Centre', key: 'center' },
  { title: 'Modalitat', key: 'modality' },
  { title: 'Alumnes', key: 'students' },
  { title: 'Data', key: 'startDate' },
  { title: 'Estat', key: 'status' },
  { title: 'Accions', key: 'actions', sortable: false },
]

const assignedWorkshops = ref([
  {
    id: 1,
    name: 'Robòtica Bàsica',
    center: 'IES Exemple',
    description: 'Introducció a la robòtica amb Arduino',
    duration: '4 hores',
    modality: 'A',
    students: 20,
    startDate: '2024-02-15',
    status: 'Assignat',
  },
  {
    id: 2,
    name: 'Programació Web',
    center: 'IES Test',
    description: 'HTML, CSS i JavaScript bàsic',
    duration: '6 hores',
    modality: 'B',
    students: 15,
    startDate: '2024-03-10',
    status: 'Pendent',
  },
])

const notifications = ref([
  {
    id: 1,
    title: 'Nova assignació',
    message: 'Has estat assignat al taller de Robòtica Bàsica',
    type: 'info',
    date: '2024-01-08',
  },
  {
    id: 2,
    title: 'Taller completat',
    message: 'El taller de Programació Web ha estat completat',
    type: 'success',
    date: '2024-01-07',
  },
  {
    id: 3,
    title: 'Recordatori',
    message: 'Completa el checklist del taller de Robòtica',
    type: 'info',
    date: '2024-01-06',
  },
])

const totalStudents = computed(() => {
  return assignedWorkshops.value.reduce((sum, w) => sum + w.students, 0)
})

const uniqueCentres = computed(() => {
  return new Set(assignedWorkshops.value.map(w => w.center)).size
})

const getStatusColor = (status) => {
  const colors = {
    'Assignat': 'success',
    'Pendent': 'warning',
    'Completat': 'info',
  }
  return colors[status] || 'default'
}

const viewWorkshopDetails = (workshop) => {
  selectedWorkshop.value = workshop
  showDetailsDialog.value = true
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

.icon-stat.success {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.icon-stat.info {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.icon-stat.warning {
  background: rgba(251, 140, 0, 0.1);
  color: #fb8c00;
}
</style>
