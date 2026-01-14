<template>
  <v-container class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <div>
          <h1 class="text-h3 font-weight-bold mb-2">Gestió de Professors</h1>
          <p class="text-grey-700">Crea i gestiona els professors del programa</p>
        </div>
        <v-btn color="primary" @click="showNewProfessorDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Afegir Professor
        </v-btn>
      </v-col>
    </v-row>

    <!-- Professors Table -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
            :headers="headers"
            :items="professors"
            class="elevation-0"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn icon small @click="editProfessor(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="deleteProfessor(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Professor Dialog -->
    <v-dialog v-model="showNewProfessorDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editingProfessor ? 'Editar Professor' : 'Afegir Professor' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveProfessor">
            <v-text-field
              v-model="professorForm.name"
              label="Nom"
              required
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="professorForm.email"
              label="Email"
              type="email"
              required
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="professorForm.phone"
              label="Telèfon"
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="professorForm.specialization"
              label="Especialitat"
              class="mb-4"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showNewProfessorDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveProfessor">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const showNewProfessorDialog = ref(false)
const editingProfessor = ref(null)

const headers = [
  { title: 'Nom', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Telèfon', key: 'phone' },
  { title: 'Especialitat', key: 'specialization' },
  { title: 'Accions', key: 'actions', sortable: false },
]

const professors = ref([
  {
    id: 1,
    name: 'Joan Martínez',
    email: 'joan.martinez@example.com',
    phone: '123456789',
    specialization: 'Robòtica',
  },
  {
    id: 2,
    name: 'Maria García',
    email: 'maria.garcia@example.com',
    phone: '987654321',
    specialization: 'Programació',
  },
  {
    id: 3,
    name: 'Pere López',
    email: 'pere.lopez@example.com',
    phone: '555666777',
    specialization: 'Impressió 3D',
  },
])

const professorForm = ref({
  name: '',
  email: '',
  phone: '',
  specialization: '',
})

const editProfessor = (professor) => {
  editingProfessor.value = professor.id
  professorForm.value = { ...professor }
  showNewProfessorDialog.value = true
}

const saveProfessor = () => {
  if (editingProfessor.value) {
    const index = professors.value.findIndex(p => p.id === editingProfessor.value)
    if (index !== -1) {
      professors.value[index] = { ...professorForm.value, id: editingProfessor.value }
    }
  } else {
    professors.value.push({
      ...professorForm.value,
      id: Math.max(...professors.value.map(p => p.id), 0) + 1,
    })
  }
  showNewProfessorDialog.value = false
  editingProfessor.value = null
  professorForm.value = {
    name: '',
    email: '',
    phone: '',
    specialization: '',
  }
}

const deleteProfessor = (id) => {
  const index = professors.value.findIndex(p => p.id === id)
  if (index !== -1) {
    professors.value.splice(index, 1)
  }
}
</script>

<style scoped>
</style>
