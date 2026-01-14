/**
 * Assignment Engine Service
 */

export class AssignmentEngine {
  /**
   * Aquí ocurre la magia del reparto.
   */
  static runAssignmentAlgorithm(requests, workshops, professors) {
    const assignments = []
    const assignmentErrors = []
    
    // Usamos Maps para no tocar los datos originales y trabajar más cómodos
    const workshopCapacity = new Map()
    const professorAssignments = new Map()

    // Apuntamos cuántas plazas tiene cada taller al empezar
    workshops.forEach(workshop => {
      workshopCapacity.set(workshop.id, workshop.max_places)
    })

    // Preparamos la agenda de cada profe (empezamos con lista vacía)
    professors.forEach(prof => {
      professorAssignments.set(prof.id, [])
    })
    // Ordenamos las peticiones por prioridad:
    // Si no tienen prioridad, los mandamos al final de la cola
    const sortedRequests = [...requests].sort((a, b) => {
      return (a.priority || 999) - (b.priority || 999)
    })

    // Empezamos a procesar las peticiones una a una
    sortedRequests.forEach(request => {
      const requestedWorkshops = request.requested_workshops || []

      requestedWorkshops.forEach(reqWorkshop => {
        const workshop = workshops.find(w => w.id === reqWorkshop.workshop_id)
        const availablePlaces = workshopCapacity.get(workshop.id)

        // Paso 1: ¿Caben los alumnos en este taller?
        if (availablePlaces >= reqWorkshop.estimated_students) {
          
          // Paso 2: Necesitamos a dos profes que estén libres para este taller
          const availableProfessors = this.findAvailableProfessors(
            workshop.id,
            professors,
            professorAssignments,
            2
          )

          if (availableProfessors.length >= 2) {
            // Si hay sitio y hay profes, confirmamos la asignación
            const assignment = {
              id: Math.random().toString(36).substr(2, 9), // ID rápido para salir del paso
              request_id: request.id,
              workshop_id: workshop.id,
              center_id: request.center_id,
              assigned_students: reqWorkshop.estimated_students,
              professors: availableProfessors.slice(0, 2),
              status: 'ASSIGNED',
              assigned_at: new Date().toISOString(),
            }

            assignments.push(assignment)

            // Actualizamos el inventario: menos plazas libres
            const newCapacity = availablePlaces - reqWorkshop.estimated_students
            workshopCapacity.set(workshop.id, newCapacity)

            // Les llenamos la agenda a los profes elegidos
            availableProfessors.slice(0, 2).forEach(profId => {
              const profs = professorAssignments.get(profId) || []
              profs.push(workshop.id)
              professorAssignments.set(profId, profs)
            })
          } else {
            // Error: Tenemos sitio, pero no hay profes disponibles
            assignmentErrors.push({
              request_id: request.id,
              workshop_id: workshop.id,
              reason: 'NOT_ENOUGH_PROFESSORS',
              message: `No hay suficientes profes libres para el taller: ${workshop.title}`,
            })
          }
        } else {
          // Error: El taller está a tope
          assignmentErrors.push({
            request_id: request.id,
            workshop_id: workshop.id,
            reason: 'INSUFFICIENT_CAPACITY',
            message: `No caben. Quieren ${reqWorkshop.estimated_students} pero solo quedan ${availablePlaces} plazas en ${workshop.title}`,
          })
        }
      })
    })

    // Devolvemos el resultado final y un resumen de cómo ha ido la cosa
    return {
      assignments,
      errors: assignmentErrors,
      summary: {
        total_requests: requests.length,
        total_assignments: assignments.length,
        total_errors: assignmentErrors.length,
        success_rate: ((assignments.length / requests.length) * 100).toFixed(2) + '%',
      },
    }
  }

  /*
   Filtro para encontrar profes que no estén saturados.
   */
  static findAvailableProfessors(workshopId, professors, assignments, needed = 2) {
    const available = []
    const maxAssignmentsPerProfessor = 5 // Por ahora ponemos el límite en 5 talleres por profe

    professors.forEach(prof => {
      const currentAssignments = assignments.get(prof.id) || []

      // Solo miramos profes activos
      if (prof.active && prof.availability) {
        // No queremos que el mismo profe repita el mismo taller si ya lo tiene asignado
        if (!currentAssignments.includes(workshopId)) {
          // Si aún no ha llegado al máximo de 5, nos sirve
          if (currentAssignments.length < maxAssignmentsPerProfessor) {
            available.push(prof.id)
          }
        }
      }
    })

    return available.slice(0, needed)
  }

  /*
    Por si un administrador quiere forzar una asignación a mano.
   */
  static manualAssignment(request, workshop, professors, center) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      request_id: request.id,
      workshop_id: workshop.id,
      center_id: center.id,
      assigned_students: request.estimated_students,
      professors: professors,
      status: 'ASSIGNED',
      assigned_at: new Date().toISOString(),
      manual: true, // Marcamos que esto se ha hecho a dedo
    }
  }

  /*
    Un chequeo rápido para no guardar datos que den problemas.
   */
  static validateAssignment(assignment, workshops, professors) {
    const errors = []

    // ¿Existe el taller?
    if (!workshops.find(w => w.id === assignment.workshop_id)) {
      errors.push('El taller no existe en la base de datos')
    }

    // ¿Existen los profes?
    assignment.professors.forEach(profId => {
      if (!professors.find(p => p.id === profId)) {
        errors.push(`No encuentro al profesor con ID: ${profId}`)
      }
    })

    // Norma de la casa: mínimo 2 profes por taller por seguridad
    if (assignment.professors.length < 2) {
      errors.push('Hacen falta al menos 2 profesores para que sea válido')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /*
    Prepara los datos para que el jefe pueda ver las estadísticas.
   */
  static generateReport(assignments, workshops, centers) {
    const report = {
      total_assignments: assignments.length,
      by_workshop: {},
      by_center: {},
      by_professor: {},
      total_students: 0,
    }

    assignments.forEach(assignment => {
      const workshop = workshops.find(w => w.id === assignment.workshop_id)
      const center = centers.find(c => c.id === assignment.center_id)

      // Agrupamos por taller
      if (!report.by_workshop[workshop.id]) {
        report.by_workshop[workshop.id] = {
          name: workshop.title,
          assignments: 0,
          students: 0,
        }
      }
      report.by_workshop[workshop.id].assignments++
      report.by_workshop[workshop.id].students += assignment.assigned_students

      // Agrupamos por centro escolar
      if (!report.by_center[center.id]) {
        report.by_center[center.id] = {
          name: center.name,
          assignments: 0,
          students: 0,
        }
      }
      report.by_center[center.id].assignments++
      report.by_center[center.id].students += assignment.assigned_students

      // Suma total de alumnos que van a disfrutar de los talleres
      report.total_students += assignment.assigned_students

      // ¿Cuánto trabajo tiene cada profe?
      assignment.professors.forEach(profId => {
        if (!report.by_professor[profId]) {
          report.by_professor[profId] = {
            assignments: 0,
            workshops: [],
          }
        }
        report.by_professor[profId].assignments++
        if (!report.by_professor[profId].workshops.includes(assignment.workshop_id)) {
          report.by_professor[profId].workshops.push(assignment.workshop_id)
        }
      })
    })

    return report
  }
}

export default AssignmentEngine