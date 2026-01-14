import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkshopStore = defineStore('workshop', () => {
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

  const addWorkshop = (workshop) => {
    workshops.value.push({
      ...workshop,
      id: Math.max(...workshops.value.map((w) => w.id), 0) + 1,
    })
  }

  const updateWorkshop = (id, updatedWorkshop) => {
    const index = workshops.value.findIndex((w) => w.id === id)
    if (index !== -1) {
      workshops.value[index] = { ...workshops.value[index], ...updatedWorkshop }
    }
  }

  const deleteWorkshop = (id) => {
    workshops.value = workshops.value.filter((w) => w.id !== id)
  }

  const getWorkshopById = (id) => {
    return workshops.value.find((w) => w.id === id)
  }

  return {
    workshops,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
    getWorkshopById,
  }
})
