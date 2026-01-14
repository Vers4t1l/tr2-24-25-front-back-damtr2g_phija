<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1>Administració</h1>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Gestió de Tallers</v-card-title>
          <v-card-text>
            <v-btn color="primary" @click="showWorkshopDialog = true" class="mb-4">
              <v-icon left>mdi-plus</v-icon>
              Afegir Taller
            </v-btn>
            <v-list>
              <v-list-item v-for="workshop in workshops" :key="workshop.id">
                <v-list-item-title>{{ workshop.name }}</v-list-item-title>
                <template v-slot:append>
                  <v-btn icon small @click="editWorkshop(workshop)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small @click="deleteWorkshop(workshop.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Gestió de Professors</v-card-title>
          <v-card-text>
            <v-btn color="primary" @click="showProfessorDialog = true" class="mb-4">
              <v-icon left>mdi-plus</v-icon>
              Afegir Professor
            </v-btn>
            <v-list>
              <v-list-item v-for="professor in professors" :key="professor.id">
                <v-list-item-title>{{ professor.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ professor.email }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn icon small @click="editProfessor(professor)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small @click="deleteProfessor(professor.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Sol·licituds de Centres</v-card-title>
          <v-data-table
            :headers="requestHeaders"
            :items="requests"
            class="elevation-1"
          >
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)">
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn small color="primary" @click="assignWorkshop(item)">
                Assignar
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Workshop Dialog -->
    <v-dialog v-model="showWorkshopDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editingWorkshop ? 'Editar Taller' : 'Afegir Taller' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveWorkshop">
            <v-text-field
              v-model="workshopForm.name"
              label="Nom del Taller"
              required
            ></v-text-field>
            <v-textarea
              v-model="workshopForm.description"
              label="Descripció"
              required
            ></v-textarea>
            <v-text-field
              v-model="workshopForm.duration"
              label="Durada"
              required
            ></v-text-field>
            <v-text-field
              v-model.number="workshopForm.places"
              label="Places"
              type="number"
              required
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
          <v-btn @click="showWorkshopDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveWorkshop">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Professor Dialog -->
    <v-dialog v-model="showProfessorDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editingProfessor ? 'Editar Professor' : 'Afegir Professor' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveProfessor">
            <v-text-field
              v-model="professorForm.name"
              label="Nom"
              required
            ></v-text-field>
            <v-text-field
              v-model="professorForm.email"
              label="Email"
              type="email"
              required
            ></v-text-field>
            <v-text-field
              v-model="professorForm.phone"
              label="Telèfon"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showProfessorDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveProfessor">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const showWorkshopDialog = ref(false)
const showProfessorDialog = ref(false)
const editingWorkshop = ref(null)
const editingProfessor = ref(null)

const requestHeaders = [
  { title: 'Centre', key: 'centerName' },
  { title: 'Modalitat', key: 'modality' },
  { title: 'Alumnes', key: 'estimatedStudents' },
  { title: 'Estat', key: 'status' },
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
])

const professors = ref([
  {
    id: 1,
    name: 'Joan Martínez',
    email: 'joan.martinez@example.com',
    phone: '123456789',
  },
  {
    id: 2,
    name: 'Maria García',
    email: 'maria.garcia@example.com',
    phone: '987654321',
  },
])

const requests = ref([
  {
    id: 1,
    centerName: 'IES Exemple',
    modality: 'A',
    estimatedStudents: 25,
    status: 'Pendent',
  },
  {
    id: 2,
    centerName: 'IES Test',
    modality: 'B',
    estimatedStudents: 30,
    status: 'Pendent',
  },
])

const workshopForm = ref({
  name: '',
  description: '',
  duration: '',
  places: 0,
  modality: '',
})

const professorForm = ref({
  name: '',
  email: '',
  phone: '',
})

const getStatusColor = (status) => {
  const colors = {
    Pendent: 'warning',
    Assignat: 'success',
    Rebutjat: 'error',
  }
  return colors[status] || 'default'
}

const editWorkshop = (workshop) => {
  editingWorkshop.value = workshop.id
  workshopForm.value = { ...workshop }
  showWorkshopDialog.value = true
}

const saveWorkshop = () => {
  if (editingWorkshop.value) {
    const index = workshops.value.findIndex((w) => w.id === editingWorkshop.value)
    if (index !== -1) {
      workshops.value[index] = { ...workshopForm.value, id: editingWorkshop.value }
    }
  } else {
    workshops.value.push({
      ...workshopForm.value,
      id: Math.max(...workshops.value.map((w) => w.id), 0) + 1,
    })
  }
  showWorkshopDialog.value = false
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
  workshops.value = workshops.value.filter((w) => w.id !== id)
}

const editProfessor = (professor) => {
  editingProfessor.value = professor.id
  professorForm.value = { ...professor }
  showProfessorDialog.value = true
}

const saveProfessor = () => {
  if (editingProfessor.value) {
    const index = professors.value.findIndex((p) => p.id === editingProfessor.value)
    if (index !== -1) {
      professors.value[index] = { ...professorForm.value, id: editingProfessor.value }
    }
  } else {
    professors.value.push({
      ...professorForm.value,
      id: Math.max(...professors.value.map((p) => p.id), 0) + 1,
    })
  }
  showProfessorDialog.value = false
  editingProfessor.value = null
  professorForm.value = {
    name: '',
    email: '',
    phone: '',
  }
}

const deleteProfessor = (id) => {
  professors.value = professors.value.filter((p) => p.id !== id)
}

const assignWorkshop = (request) => {
  const index = requests.value.findIndex((r) => r.id === request.id)
  if (index !== -1) {
    requests.value[index].status = 'Assignat'
  }
}
</script>

<style scoped>
</style>
