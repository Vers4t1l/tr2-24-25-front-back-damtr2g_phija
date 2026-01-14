<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1>Centres Educatius</h1>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-btn color="primary" @click="showNewRequestDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Nova Sol·licitud de Tallers
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Tallers Disponibles</v-card-title>
          <v-data-table
            :headers="headers"
            :items="availableWorkshops"
            class="elevation-1"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn small color="primary" @click="selectWorkshop(item)">
                Seleccionar
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Les Meves Sol·licituds</v-card-title>
          <v-data-table
            :headers="requestHeaders"
            :items="myRequests"
            class="elevation-1"
          >
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)">
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog for new request -->
    <v-dialog v-model="showNewRequestDialog" max-width="500px">
      <v-card>
        <v-card-title>Nova Sol·licitud de Tallers</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitRequest">
            <v-text-field
              v-model="newRequest.centerName"
              label="Nom del Centre"
              required
            ></v-text-field>
            <v-text-field
              v-model.number="newRequest.estimatedStudents"
              label="Nombre aproximat d'alumnes"
              type="number"
              required
            ></v-text-field>
            <v-select
              v-model="newRequest.modality"
              :items="['A', 'B', 'C']"
              label="Modalitat"
              required
            ></v-select>
            <v-textarea
              v-model="newRequest.preferences"
              label="Preferències i comentaris"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showNewRequestDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="submitRequest">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const showNewRequestDialog = ref(false)

const headers = [
  { title: 'Nom del Taller', key: 'name' },
  { title: 'Descripció', key: 'description' },
  { title: 'Durada', key: 'duration' },
  { title: 'Places', key: 'places' },
  { title: 'Modalitat', key: 'modality' },
  { title: 'Accions', key: 'actions', sortable: false },
]

const requestHeaders = [
  { title: 'Centre', key: 'centerName' },
  { title: 'Modalitat', key: 'modality' },
  { title: 'Alumnes', key: 'estimatedStudents' },
  { title: 'Estat', key: 'status' },
  { title: 'Data', key: 'date' },
]

const availableWorkshops = ref([
  {
    id: 1,
    name: 'Robòtica Bàsica',
    description: 'Introducció a la robòtica amb Arduino',
    duration: '4 hores',
    places: 20,
    modality: 'A',
  },
  {
    id: 2,
    name: 'Programació Web',
    description: 'HTML, CSS i JavaScript bàsic',
    duration: '6 hores',
    places: 15,
    modality: 'B',
  },
  {
    id: 3,
    name: 'Impressió 3D',
    description: 'Disseny i impressió de models 3D',
    duration: '4 hores',
    places: 10,
    modality: 'C',
  },
])

const myRequests = ref([
  {
    id: 1,
    centerName: 'IES Exemple',
    modality: 'A',
    estimatedStudents: 25,
    status: 'Pendent',
    date: '2024-01-08',
  },
])

const newRequest = ref({
  centerName: '',
  estimatedStudents: 0,
  modality: '',
  preferences: '',
})

const getStatusColor = (status) => {
  const colors = {
    Pendent: 'warning',
    Assignat: 'success',
    Rebutjat: 'error',
  }
  return colors[status] || 'default'
}

const selectWorkshop = (workshop) => {
  console.log('Workshop seleccionat:', workshop)
}

const submitRequest = () => {
  myRequests.value.push({
    id: myRequests.value.length + 1,
    centerName: newRequest.value.centerName,
    modality: newRequest.value.modality,
    estimatedStudents: newRequest.value.estimatedStudents,
    status: 'Pendent',
    date: new Date().toISOString().split('T')[0],
  })
  showNewRequestDialog.value = false
  newRequest.value = {
    centerName: '',
    estimatedStudents: 0,
    modality: '',
    preferences: '',
  }
}
</script>

<style scoped>
</style>
