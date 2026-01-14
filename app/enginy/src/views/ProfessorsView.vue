<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1>Professors</h1>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Els Meus Tallers Assignats</v-card-title>
          <v-data-table
            :headers="headers"
            :items="assignedWorkshops"
            class="elevation-1"
          >
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)">
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn small color="primary" @click="viewDetails(item)">
                Detalls
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Notificacions</v-card-title>
          <v-list>
            <v-list-item v-for="notification in notifications" :key="notification.id">
              <v-list-item-title>{{ notification.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-chip size="small" :color="notification.type === 'info' ? 'info' : 'success'">
                  {{ notification.date }}
                </v-chip>
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
          <p><strong>Centre:</strong> {{ selectedWorkshop.center }}</p>
          <p><strong>Descripció:</strong> {{ selectedWorkshop.description }}</p>
          <p><strong>Durada:</strong> {{ selectedWorkshop.duration }}</p>
          <p><strong>Modalitat:</strong> {{ selectedWorkshop.modality }}</p>
          <p><strong>Alumnes assignats:</strong> {{ selectedWorkshop.students }}</p>
          <p><strong>Data de inici:</strong> {{ selectedWorkshop.startDate }}</p>
          <p><strong>Estat:</strong> {{ selectedWorkshop.status }}</p>
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
import { ref } from 'vue'

const showDetailsDialog = ref(false)
const selectedWorkshop = ref(null)

const headers = [
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

const getStatusColor = (status) => {
  const colors = {
    Assignat: 'success',
    Pendent: 'warning',
    Completat: 'info',
  }
  return colors[status] || 'default'
}

const viewDetails = (workshop) => {
  selectedWorkshop.value = workshop
  showDetailsDialog.value = true
}
</script>

<style scoped>
</style>
