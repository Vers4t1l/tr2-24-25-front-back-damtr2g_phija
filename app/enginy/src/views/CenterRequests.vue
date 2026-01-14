<template>
  <v-container class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Les meves Peticions</h1>
        <p class="text-grey-700">Consulta l'estat de les teves sol·licituds de tallers</p>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-select
          v-model="filterStatus"
          :items="['Totes', 'Pendent', 'Assignat', 'Rebutjat']"
          label="Filtrar per estat"
          outlined
          dense
        ></v-select>
      </v-col>
    </v-row>

    <!-- Requests Table -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
            :headers="headers"
            :items="filteredRequests"
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
              <v-btn icon small @click="viewDetails(item)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn v-if="item.status === 'Pendent'" icon small @click="deleteRequest(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Details Dialog -->
    <v-dialog v-model="showDetailsDialog" max-width="600px">
      <v-card v-if="selectedRequest">
        <v-card-title>Detalls de la Petició</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <p><strong>Taller:</strong> {{ selectedRequest.workshop }}</p>
              <p><strong>Modalitat:</strong> {{ selectedRequest.modality }}</p>
              <p><strong>Alumnes:</strong> {{ selectedRequest.estimatedStudents }}</p>
            </v-col>
            <v-col cols="12" md="6">
              <p><strong>Estat:</strong> <v-chip :color="getStatusColor(selectedRequest.status)" text-color="white" size="small">{{ selectedRequest.status }}</v-chip></p>
              <p><strong>Data de sol·licitud:</strong> {{ selectedRequest.date }}</p>
              <p><strong>Preferències:</strong> {{ selectedRequest.preferences || 'Cap' }}</p>
            </v-col>
          </v-row>
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

const filterStatus = ref('Totes')
const showDetailsDialog = ref(false)
const selectedRequest = ref(null)

const headers = [
  { title: 'Taller', key: 'workshop' },
  { title: 'Modalitat', key: 'modality' },
  { title: 'Alumnes', key: 'estimatedStudents' },
  { title: 'Estat', key: 'status' },
  { title: 'Data', key: 'date' },
  { title: 'Accions', key: 'actions', sortable: false },
]

const requests = ref([
  {
    id: 1,
    workshop: 'Robòtica Bàsica',
    modality: 'A',
    estimatedStudents: 25,
    status: 'Pendent',
    date: '2024-01-08',
    preferences: 'Preferim dimarts',
  },
  {
    id: 2,
    workshop: 'Programació Web',
    modality: 'B',
    estimatedStudents: 30,
    status: 'Assignat',
    date: '2024-01-07',
    preferences: 'Amb dos professors',
  },
  {
    id: 3,
    workshop: 'Impressió 3D',
    modality: 'C',
    estimatedStudents: 15,
    status: 'Rebutjat',
    date: '2024-01-06',
    preferences: 'Cap',
  },
])

const filteredRequests = computed(() => {
  if (filterStatus.value === 'Totes') {
    return requests.value
  }
  return requests.value.filter(r => r.status === filterStatus.value)
})

const getStatusColor = (status) => {
  const colors = {
    'Pendent': 'warning',
    'Assignat': 'success',
    'Rebutjat': 'error',
  }
  return colors[status] || 'default'
}

const viewDetails = (request) => {
  selectedRequest.value = request
  showDetailsDialog.value = true
}

const deleteRequest = (id) => {
  const index = requests.value.findIndex(r => r.id === id)
  if (index !== -1) {
    requests.value.splice(index, 1)
  }
}
</script>

<style scoped>
</style>
