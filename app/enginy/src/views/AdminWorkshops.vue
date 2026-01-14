<template>
  <v-container class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <div>
          <h1 class="text-h3 font-weight-bold mb-2">Gestió de Tallers</h1>
          <p class="text-grey-700">Crea, edita i gestiona els tallers del catàleg</p>
        </div>
        <v-btn color="primary" @click="showNewWorkshopDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Crear Taller
        </v-btn>
      </v-col>
    </v-row>

    <!-- Workshops Table -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
            :headers="headers"
            :items="workshops"
            class="elevation-0"
          >
            <template v-slot:item.modality="{ item }">
              <v-chip :color="getModalityColor(item.modality)" text-color="white" size="small">
                {{ item.modality }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon small @click="editWorkshop(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="deleteWorkshop(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Workshop Dialog -->
    <v-dialog v-model="showNewWorkshopDialog" max-width="600px">
      <v-card>
        <v-card-title>{{ editingWorkshop ? 'Editar Taller' : 'Crear Taller' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveWorkshop">
            <v-text-field
              v-model="workshopForm.name"
              label="Nom del Taller"
              required
              class="mb-4"
            ></v-text-field>
            <v-textarea
              v-model="workshopForm.description"
              label="Descripció"
              required
              class="mb-4"
            ></v-textarea>
            <v-text-field
              v-model="workshopForm.duration"
              label="Durada (ex: 4 hores)"
              required
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model.number="workshopForm.places"
              label="Places disponibles"
              type="number"
              required
              class="mb-4"
            ></v-text-field>
            <v-select
              v-model="workshopForm.modality"
              :items="['A', 'B', 'C']"
              label="Modalitat"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showNewWorkshopDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveWorkshop">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const showNewWorkshopDialog = ref(false)
const editingWorkshop = ref(null)

const headers = [
  { title: 'Nom', key: 'name' },
  { title: 'Descripció', key: 'description' },
  { title: 'Durada', key: 'duration' },
  { title: 'Places', key: 'places' },
  { title: 'Modalitat', key: 'modality' },
  { title: 'Accions', key: 'actions', sortable: false },
]

const workshops = ref([
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

const workshopForm = ref({
  name: '',
  description: '',
  duration: '',
  places: 0,
  modality: '',
})

const getModalityColor = (modality) => {
  const colors = {
    'A': '#1f71b8',
    'B': '#26a69a',
    'C': '#667eea',
  }
  return colors[modality] || '#666'
}

const editWorkshop = (workshop) => {
  editingWorkshop.value = workshop.id
  workshopForm.value = { ...workshop }
  showNewWorkshopDialog.value = true
}

const saveWorkshop = () => {
  if (editingWorkshop.value) {
    const index = workshops.value.findIndex(w => w.id === editingWorkshop.value)
    if (index !== -1) {
      workshops.value[index] = { ...workshopForm.value, id: editingWorkshop.value }
    }
  } else {
    workshops.value.push({
      ...workshopForm.value,
      id: Math.max(...workshops.value.map(w => w.id), 0) + 1,
    })
  }
  showNewWorkshopDialog.value = false
  editingWorkshop.value = null
  workshopForm.value = {
    name: '',
    description: '',
    duration: '',
    places: 0,
    modality: '',
  }
}

const deleteWorkshop = (id) => {
  const index = workshops.value.findIndex(w => w.id === id)
  if (index !== -1) {
    workshops.value.splice(index, 1)
  }
}
</script>

<style scoped>
</style>
