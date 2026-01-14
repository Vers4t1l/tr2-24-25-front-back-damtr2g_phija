/** Servicio de Notificaciones
  Se encarga de crear avisos, montar los emails y controlar qué se ha leído.
*/

export class NotificationService {
  /** Tipos de eventos que disparan una notificación. */
  static TYPES = {
    ASSIGNMENT_RESULT: 'ASSIGNMENT_RESULT',
    PROFESSOR_ASSIGNMENT: 'PROFESSOR_ASSIGNMENT',
    CHECKLIST_REMINDER: 'CHECKLIST_REMINDER',
    EVALUATION_INVITATION: 'EVALUATION_INVITATION',
    WORKSHOP_REMINDER: 'WORKSHOP_REMINDER',
    DOCUMENT_APPROVED: 'DOCUMENT_APPROVED',
    DOCUMENT_REJECTED: 'DOCUMENT_REJECTED',
  }

  /** Genera el objeto de notificación básico para la base de datos. */
  static createNotification(userId, type, data) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      type,
      message: this.generateMessage(type, data),
      data,
      read: false,
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
  }

  /** Escoge el texto que verá el usuario según el tipo de aviso. */
  static generateMessage(type, data) {
    const messages = {
      [this.TYPES.ASSIGNMENT_RESULT]: `S'ha processat la teva sol·licitud de tallers. ${data.assigned_count} taller(s) assignat(s).`,
      [this.TYPES.PROFESSOR_ASSIGNMENT]: `Has estat assignat com a professor referent del taller "${data.workshop_name}".`,
      [this.TYPES.CHECKLIST_REMINDER]: `Recordatori: Completa el checklist per al taller "${data.workshop_name}".`,
      [this.TYPES.EVALUATION_INVITATION]: `Estàs convidat a completar l'avaluació del taller "${data.workshop_name}".`,
      [this.TYPES.WORKSHOP_REMINDER]: `Recordatori: El taller "${data.workshop_name}" comença demà.`,
      [this.TYPES.DOCUMENT_APPROVED]: `El document "${data.document_name}" ha estat aprovat.`,
      [this.TYPES.DOCUMENT_REJECTED]: `El document "${data.document_name}" ha estat rebutjat. Raó: ${data.reason}`,
    }

    return messages[type] || 'Nova notificació'
  }

  /** Selecciona la plantilla de email correspondiente. */
  static generateEmailTemplate(type, data, recipientName) {
    const templates = {
      [this.TYPES.ASSIGNMENT_RESULT]: this.emailAssignmentResult(data, recipientName),
      [this.TYPES.PROFESSOR_ASSIGNMENT]: this.emailProfessorAssignment(data, recipientName),
      [this.TYPES.CHECKLIST_REMINDER]: this.emailChecklistReminder(data, recipientName),
      [this.TYPES.EVALUATION_INVITATION]: this.emailEvaluationInvitation(data, recipientName),
    }

    return templates[type] || { subject: 'ENGINY Hub', body: 'Nova notificació' }
  }

  /** Plantilla: Informe de resultados de la solicitud. */
  static emailAssignmentResult(data, recipientName) {
    return {
      subject: 'Resultat de la teva sol·licitud de tallers - ENGINY Hub',
      body: `
        <h2>Hola ${recipientName},</h2>
        <p>S'ha processat la teva sol·licitud de tallers del programa ENGINY.</p>
        
        <h3>Resum de l'assignació:</h3>
        <ul>
          <li><strong>Tallers assignats:</strong> ${data.assigned_count}</li>
          <li><strong>Tallers pendent:</strong> ${data.pending_count}</li>
          <li><strong>Tallers rebutjats:</strong> ${data.rejected_count}</li>
        </ul>
        
        <p>Accedeix a la plataforma per veure els detalls complets de la teva assignació.</p>
        
        <p>Salutacions,<br>Equip ENGINY Hub</p>
      `,
    }
  }

  /** Plantilla: Aviso a un profesor de que le toca un taller. */
  static emailProfessorAssignment(data, recipientName) {
    return {
      subject: `Assignació com a professor referent - ${data.workshop_name}`,
      body: `
        <h2>Hola ${recipientName},</h2>
        <p>Has estat assignat com a professor referent del taller:</p>
        
        <h3>${data.workshop_name}</h3>
        <p><strong>Descripció:</strong> ${data.workshop_description}</p>
        <p><strong>Durada:</strong> ${data.duration}</p>
        <p><strong>Centre:</strong> ${data.center_name}</p>
        <p><strong>Alumnes estimats:</strong> ${data.estimated_students}</p>
        
        <p>Accedeix a la plataforma per veure más detalls.</p>
        
        <p>Salutacions,<br>Equip ENGINY Hub</p>
      `,
    }
  }

  /** Plantilla: Recordatorio de tareas pendientes (checklist). */
  static emailChecklistReminder(data, recipientName) {
    return {
      subject: `Recordatori: Completa el checklist - ${data.workshop_name}`,
      body: `
        <h2>Hola ${recipientName},</h2>
        <p>Recordatori: Necessites completar el checklist per al taller:</p>
        
        <h3>${data.workshop_name}</h3>
        <p>Elements pendents:</p>
        <ul>
          ${data.pending_items.map(item => `<li>${item}</li>`).join('')}
        </ul>
        
        <p>Accedeix a la plataforma per completar els elements pendents.</p>
        
        <p>Salutacions,<br>Equip ENGINY Hub</p>
      `,
    }
  }

  /** Plantilla: Invitación para que evalúen el taller. */
  static emailEvaluationInvitation(data, recipientName) {
    return {
      subject: `Invitació a avaluar - ${data.workshop_name}`,
      body: `
        <h2>Hola ${recipientName},</h2>
        <p>T'invitem a completar l'avaluació del taller:</p>
        
        <h3>${data.workshop_name}</h3>
        <p>La teva opinió és molt important per millorar el programa ENGINY.</p>
        
        <p>Accedeix a la plataforma per completar el qüestionari d'avaluació.</p>
        
        <p>Salutacions,<br>Equip ENGINY Hub</p>
      `,
    }
  }

  /** Cambia el estado a leído y pone la fecha actual. */
  static markAsRead(notification) {
    return {
      ...notification,
      read: true,
      read_at: new Date().toISOString(),
    }
  }

  /** Mapea un array de notificaciones para ponerlas todas como leídas. */
  static markAllAsRead(notifications) {
    return notifications.map(n => this.markAsRead(n))
  }

  /** Cuenta cuántas notificaciones hay sin leer. */
  static getUnreadCount(notifications) {
    return notifications.filter(n => !n.read).length
  }

  /** Simulación de envío de email (log por consola). */
  static async sendEmail(to, subject, body) {
    console.log(`[EMAIL] To: ${to}`)
    console.log(`[EMAIL] Subject: ${subject}`)
    console.log(`[EMAIL] Body: ${body}`)

    return {
      success: true,
      message_id: Math.random().toString(36).substr(2, 9),
      sent_at: new Date().toISOString(),
    }
  }

  /** Envía emails de forma masiva recorriendo una lista de usuarios. */
  static async sendBulkNotifications(notifications, users) {
    const results = []

    for (const notification of notifications) {
      const user = users.find(u => u.id === notification.user_id)
      if (user) {
        const template = this.generateEmailTemplate(
          notification.type,
          notification.data,
          user.name
        )

        const result = await this.sendEmail(user.email, template.subject, template.body)
        results.push({
          user_id: user.id,
          notification_id: notification.id,
          ...result,
        })
      }
    }

    return results
  }

  /** Filtros varios para las listas de notificaciones. */
  static filterByType(notifications, type) {
    return notifications.filter(n => n.type === type)
  }

  static filterUnread(notifications) {
    return notifications.filter(n => !n.read)
  }

  static filterByDateRange(notifications, startDate, endDate) {
    return notifications.filter(n => {
      const notifDate = new Date(n.created_at)
      return notifDate >= startDate && notifDate <= endDate
    })
  }
}

export default NotificationService