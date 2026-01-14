import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRequestStore = defineStore('request', () => {
  const requests = ref([
    {
      id: 1,
      centerName: 'IES Exemple',
      modality: 'A',
      estimatedStudents: 25,
      status: 'Pendent',
      date: '2024-01-08',
    },
  ])

  const addRequest = (request) => {
    requests.value.push({
      ...request,
      id: Math.max(...requests.value.map((r) => r.id), 0) + 1,
      date: new Date().toISOString().split('T')[0],
      status: 'Pendent',
    })
  }

  const updateRequest = (id, updatedRequest) => {
    const index = requests.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      requests.value[index] = { ...requests.value[index], ...updatedRequest }
    }
  }

  const deleteRequest = (id) => {
    requests.value = requests.value.filter((r) => r.id !== id)
  }

  const getRequestById = (id) => {
    return requests.value.find((r) => r.id === id)
  }

  return {
    requests,
    addRequest,
    updateRequest,
    deleteRequest,
    getRequestById,
  }
})
