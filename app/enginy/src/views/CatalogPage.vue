<template>
  <v-container class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Catàleg de Tallers</h1>
        <p class="text-grey-700">Explora els tallers disponibles i sol·licita places per als teus alumnes</p>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="searchQuery"
          label="Cercar tallers"
          prepend-icon="mdi-magnify"
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="selectedModality"
          :items="['A', 'B', 'C']"
          label="Modalitat"
          outlined
          dense
          clearable
        ></v-select>
      </v-col>
    </v-row>

    <!-- Workshops Grid -->
    <v-row>
      <v-col v-for="workshop in filteredWorkshops" :key="workshop.id" cols="12" md="6" lg="4">
        <v-card class="workshop-card h-100">
          <v-card-item>
            <div class="d-flex align-center justify-space-between mb-3">
              <v-chip :color="getModalityColor(workshop.modality)" text-color="white" size="small">
                Modalitat {{ workshop.modality }}
              </v-chip>
              <v-icon size="24" color="primary">mdi-star</v-icon>
            </div>
            <v-card-title class="pa-0 mb-2">{{ workshop.name }}</v-card-title>
            <v-card-subtitle class="pa-0 mb-4">{{ workshop.description }}</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <div class="workshop-info">
              <div class="info-row">
                <v-icon size="18" color="grey-700">mdi-clock</v-icon>
                <span>{{ workshop.duration }}</span>
              </div>
              <div class="info-row">
                <v-icon size="18" color="grey-700">mdi-users</v-icon>
                <span>{{ workshop.places }} places disponibles</span>
              </div>
              <div class="info-row">
                <v-icon size="18" color="grey-700">mdi-account-tie</v-icon>
                <span>{{ workshop.professors }} professors</span>
              </div>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" block @click="selectWorkshop(workshop)">
              Seleccionar
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Request Dialog -->
    <v-dialog v-model="showRequestDialog" max-width="500px">
      <v-card v-if="selectedWorkshopData">
        <v-card-title>Sol·licitud de {{ selectedWorkshopData.name }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitRequest">
            <v-text-field
              v-model.number="requestForm.estimatedStudents"
              label="Nombre aproximat d'alumnes"
              type="number"
              required
              class="mb-4"
            ></v-text-field>
            <v-textarea
              v-model="requestForm.preferences"
              label="Preferències i comentaris"
              rows="4"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showRequestDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="submitRequest">Enviar Sol·licitud</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedModality = ref(null)
const showRequestDialog = ref(false)
const selectedWorkshopData = ref(null)

const workshops = ref([
  {
    id: 1,
    name: 'Robòtica Bàsica',
    description: 'Introducció a la robòtica amb Arduino',
    duration: '4 hores',
    places: 20,
    modality: 'A',
    professors: 2,
  },
  {
    id: 2,
    name: 'Programació Web',
    description: 'HTML, CSS i JavaScript bàsic',
    duration: '6 hores',
    places: 15,
    modality: 'B',
    professors: 2,
  },
  {
    id: 3,
    name: 'Impressió 3D',
    description: 'Disseny i impressió de models 3D',
    duration: '4 hores',
    places: 10,
    modality: 'C',
    professors: 1,
  },
  {
    id: 4,
    name: 'Realitat Virtual',
    description: 'Experiència immersiva amb VR',
    duration: '3 hores',
    places: 12,
    modality: 'A',
    professors: 2,
  },
  {
    id: 5,
    name: 'Inteligència Artificial',
    description: 'Introducció a IA i Machine Learning',
    duration: '5 hores',
    places: 18,
    modality: 'B',
    professors: 2,
  },
  {
    id: 6,
    name: 'Ciberseguretat',
    description: 'Seguretat en la web i xarxes',
    duration: '4 hores',
    places: 16,
    modality: 'C',
    professors: 1,
  },
])

const requestForm = ref({
  estimatedStudents: 0,
  preferences: '',
})

const filteredWorkshops = computed(() => {
  return workshops.value.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesModality = !selectedModality.value || w.modality === selectedModality.value
    return matchesSearch && matchesModality
  })
})

const getModalityColor = (modality) => {
  const colors = {
    'A': '#1f71b8',
    'B': '#26a69a',
    'C': '#667eea',
  }
  return colors[modality] || '#666'
}

const selectWorkshop = (workshop) => {
  selectedWorkshopData.value = workshop
  requestForm.value = {
    estimatedStudents: 0,
    preferences: '',
  }
  showRequestDialog.value = true
}

const submitRequest = () => {
  console.log('Request submitted:', {
    workshop: selectedWorkshopData.value,
    ...requestForm.value,
  })
  showRequestDialog.value = false
  // Here you would typically send this to the backend
}
</script>

<style scoped>
.workshop-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.workshop-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.workshop-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}
</style>
