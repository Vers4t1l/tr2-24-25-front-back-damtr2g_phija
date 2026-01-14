<template>
  <v-container class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Peticions de Centres</h1>
        <p class="text-grey-700">Revisa, processa i assigna peticions de tallers</p>
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
              <v-btn icon small @click="processRequest(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Process Dialog -->
    <v-dialog v-model="showProcessDialog" max-width="600px">
      <v-card v-if="selectedRequest">
        <v-card-title>Processar Petició</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <p><strong>Centre:</strong> {{ selectedRequest.centerName }}</p>
              <p><strong>Taller:</strong> {{ selectedRequest.workshop }}</p>
              <p><strong>Alumnes:</strong> {{ selectedRequest.estimatedStudents }}</p>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-row>
            <v-col cols="12">
              <v-select
                v-model="processForm.status"
                :items="['Pendent', 'Assignat', 'Rebutjat']"
                label="Nou estat"
                required
                class="mb-4"
              ></v-select>

              <v-select
                v-if="processForm.status === 'Assignat'"
                v-model="processForm.professors"
                :items="availableProfessors"
                label="Selecciona 2 professors"
                multiple
                required
                class="mb-4"
              ></v-select>

              <v-textarea
                v-model="processForm.notes"
                label="Notes (opcional)"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showProcessDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveProcessing">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const filterStatus = ref('Totes')
const showProcessDialog = ref(false)
const selectedRequest = ref(null)

const headers = [
  { title: 'Centre', key: 'centerName' },
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
    centerName: 'IES Exemple',
    workshop: 'Robòtica Bàsica',
    modality: 'A',
    estimatedStudents: 25,
    status: 'Pendent',
    date: '2024-01-08',
  },
  {
    id: 2,
    centerName: 'IES Test',
    workshop: 'Programació Web',
    modality: 'B',
    estimatedStudents: 30,
    status: 'Pendent',
    date: '2024-01-07',
  },
  {
    id: 3,
    centerName: 'IES Demo',
    workshop: 'Impressió 3D',
    modality: 'C',
    estimatedStudents: 15,
    status: 'Assignat',
    date: '2024-01-06',
  },
])

const professors = ref([
  'Joan Martínez',
  'Maria García',
  'Pere López',
  'Anna Sánchez',
  'Carlos Ruiz',
])

const processForm = ref({
  status: '',
  professors: [],
  notes: '',
})

const filteredRequests = computed(() => {
  if (filterStatus.value === 'Totes') {
    return requests.value
  }
  return requests.value.filter(r => r.status === filterStatus.value)
})

const availableProfessors = computed(() => professors.value)

const getStatusColor = (status) => {
  const colors = {
    'Pendent': 'warning',
    'Assignat': 'success',
    'Rebutjat': 'error',
  }
  return colors[status] || 'default'
}

const processRequest = (request) => {
  selectedRequest.value = request
  processForm.value = {
    status: request.status,
    professors: [],
    notes: '',
  }
  showProcessDialog.value = true
}

const saveProcessing = () => {
  const index = requests.value.findIndex(r => r.id === selectedRequest.value.id)
  if (index !== -1) {
    requests.value[index].status = processForm.value.status
  }
  showProcessDialog.value = false
  selectedRequest.value = null
}
</script>

<style scoped>
</style>
