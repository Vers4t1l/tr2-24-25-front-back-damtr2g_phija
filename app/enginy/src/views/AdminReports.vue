<template>
  <v-container class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Informes i Estadístiques</h1>
        <p class="text-grey-700">Consulta informes detallats sobre tallers, centres i professors</p>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedReport"
          :items="['Tallers', 'Centres', 'Professors', 'Satisfacció']"
          label="Selecciona informe"
          outlined
          dense
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn color="primary" @click="exportReport">
          <v-icon left>mdi-download</v-icon>
          Descarregar PDF
        </v-btn>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-item>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-700 mb-1">Tallers Totals</p>
                <p class="text-h4 font-weight-bold">24</p>
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
                <p class="text-caption text-grey-700 mb-1">Centres Participants</p>
                <p class="text-h4 font-weight-bold">156</p>
              </div>
              <div class="icon-stat secondary">
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
                <p class="text-caption text-grey-700 mb-1">Alumnes Beneficiats</p>
                <p class="text-h4 font-weight-bold">3.2k</p>
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
                <p class="text-caption text-grey-700 mb-1">Satisfacció Mitjana</p>
                <p class="text-h4 font-weight-bold">4.8/5</p>
              </div>
              <div class="icon-stat info">
                <v-icon size="28">mdi-star</v-icon>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Tallers per Modalitat</v-card-title>
          <v-card-text>
            <div class="chart-placeholder">
              <p class="text-center text-grey-500 py-12">Gràfic de distribució per modalitat</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Evolució de Peticions</v-card-title>
          <v-card-text>
            <div class="chart-placeholder">
              <p class="text-center text-grey-500 py-12">Gràfic d'evolució temporal</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detailed Table -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>Dades Detallades</v-card-title>
          <v-data-table
            :headers="detailHeaders"
            :items="detailData"
            class="elevation-0"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const selectedReport = ref('Tallers')

const detailHeaders = [
  { title: 'Nom', key: 'name' },
  { title: 'Modalitat', key: 'modality' },
  { title: 'Alumnes', key: 'students' },
  { title: 'Professors', key: 'professors' },
  { title: 'Satisfacció', key: 'satisfaction' },
]

const detailData = ref([
  {
    name: 'Robòtica Bàsica',
    modality: 'A',
    students: 120,
    professors: 2,
    satisfaction: '4.9/5',
  },
  {
    name: 'Programació Web',
    modality: 'B',
    students: 95,
    professors: 2,
    satisfaction: '4.7/5',
  },
  {
    name: 'Impressió 3D',
    modality: 'C',
    students: 60,
    professors: 1,
    satisfaction: '4.6/5',
  },
])

const exportReport = () => {
  console.log('Exporting report:', selectedReport.value)
  // Implement export logic
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

.icon-stat.secondary {
  background: rgba(38, 166, 154, 0.1);
  color: #26a69a;
}

.icon-stat.success {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.icon-stat.info {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.chart-placeholder {
  background: #f5f5f5;
  border-radius: 8px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
