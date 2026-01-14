<template>
  <v-container class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Checklist Final</h1>
        <p class="text-grey-700">Completa els passos necessaris per validar els tallers assignats</p>
      </v-col>
    </v-row>

    <!-- Progress -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-item>
            <div class="mb-4">
              <div class="d-flex justify-space-between mb-2">
                <span class="font-weight-bold">Progres General</span>
                <span class="text-primary font-weight-bold">{{ completedItems }}/{{ checklist.length }}</span>
              </div>
              <v-progress-linear
                :value="(completedItems / checklist.length) * 100"
                color="primary"
                height="8"
              ></v-progress-linear>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Checklist Items -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-list>
            <v-list-item v-for="(item, index) in checklist" :key="index" class="checklist-item">
              <template v-slot:prepend>
                <v-checkbox
                  :model-value="item.completed"
                  @update:model-value="toggleItem(index)"
                  color="primary"
                ></v-checkbox>
              </template>

              <v-list-item-title :class="{ 'text-decoration-line-through': item.completed }">
                {{ item.title }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>

              <template v-slot:append>
                <v-btn
                  v-if="item.hasFile"
                  icon
                  small
                  @click="downloadFile(item.id)"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.canUpload"
                  icon
                  small
                  @click="uploadFile(item.id)"
                >
                  <v-icon>mdi-upload</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row class="mt-6">
      <v-col cols="12" class="d-flex gap-3">
        <v-btn color="primary" size="large" @click="submitChecklist" :disabled="!allCompleted">
          <v-icon left>mdi-check</v-icon>
          Enviar Checklist
        </v-btn>
        <v-btn variant="outlined" size="large">
          Guardar Esborrador
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const checklist = ref([
  {
    id: 1,
    title: 'Confirmació de dades del centre',
    description: 'Verifica que les dades del centre siguin correctes',
    completed: true,
    canUpload: false,
    hasFile: false,
  },
  {
    id: 2,
    title: 'Llistat d\'alumnes',
    description: 'Carrega el llistat d\'alumnes que participaran',
    completed: false,
    canUpload: true,
    hasFile: false,
  },
  {
    id: 3,
    title: 'Confirmació de professors referents',
    description: 'Confirma els professors que seran referents del taller',
    completed: false,
    canUpload: false,
    hasFile: false,
  },
  {
    id: 4,
    title: 'Documentació de seguretat',
    description: 'Carrega els documents de seguretat i responsabilitat',
    completed: false,
    canUpload: true,
    hasFile: false,
  },
])

const completedItems = computed(() => checklist.value.filter(item => item.completed).length)
const allCompleted = computed(() => completedItems.value === checklist.value.length)

const toggleItem = (index) => {
  checklist.value[index].completed = !checklist.value[index].completed
}

const uploadFile = (itemId) => {
  console.log('Upload file for item:', itemId)
  // Implement file upload logic
}

const downloadFile = (itemId) => {
  console.log('Download file for item:', itemId)
  // Implement file download logic
}

const submitChecklist = () => {
  console.log('Checklist submitted')
  // Implement submit logic
}
</script>

<style scoped>
.checklist-item {
  border-bottom: 1px solid #e0e0e0;
}

.checklist-item:last-child {
  border-bottom: none;
}
</style>
