/*
  Evaluation Service
 Handles questionnaire creation, distribution, and analysis
 */

export class EvaluationService {
  /*
   Question types
   */
  static QUESTION_TYPES = {
    LIKERT: 'LIKERT',
    MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
    OPEN_TEXT: 'OPEN_TEXT',
    RATING: 'RATING',
  }

  /*
    Create a new questionnaire
   */
  static createQuestionnaire(title, description, workshopId, anonymous = false) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      workshop_id: workshopId,
      anonymous,
      questions: [],
      created_at: new Date().toISOString(),
      status: 'DRAFT',
    }
  }

  /*
    Add question to questionnaire
   */
  static addQuestion(questionnaire, type, text, options = [], required = true) {
    const question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text,
      options,
      required,
      order: questionnaire.questions.length + 1,
    }

    return {
      ...questionnaire,
      questions: [...questionnaire.questions, question],
    }
  }

  /*
    Create Likert scale question
   */
  static createLikertQuestion(questionnaire, text, scale = 5) {
    const options = Array.from({ length: scale }, (_, i) => ({
      value: i + 1,
      label: this.getLikertLabel(i + 1, scale),
    }))

    return this.addQuestion(questionnaire, this.QUESTION_TYPES.LIKERT, text, options)
  }

  /*
   Get Likert scale labels
   */
  static getLikertLabel(value, scale) {
    if (scale === 5) {
      const labels = ['Molt en desacord', 'En desacord', 'Neutre', 'D\'acord', 'Molt d\'acord']
      return labels[value - 1]
    }
    return `Opció ${value}`
  }

  /*
    Create multiple choice question
   */
  static createMultipleChoiceQuestion(questionnaire, text, choices) {
    const options = choices.map((choice, index) => ({
      value: index,
      label: choice,
    }))

    return this.addQuestion(questionnaire, this.QUESTION_TYPES.MULTIPLE_CHOICE, text, options)
  }

  /*
    Create open text question
   */
  static createOpenTextQuestion(questionnaire, text, required = false) {
    return this.addQuestion(questionnaire, this.QUESTION_TYPES.OPEN_TEXT, text, [], required)
  }

  /*
    Create rating question
   */
  static createRatingQuestion(questionnaire, text, maxRating = 5) {
    const options = Array.from({ length: maxRating }, (_, i) => ({
      value: i + 1,
      label: `${i + 1}/${maxRating}`,
    }))

    return this.addQuestion(questionnaire, this.QUESTION_TYPES.RATING, text, options)
  }

  /*
    Publish questionnaire (make it available)
   */
  static publishQuestionnaire(questionnaire) {
    if (questionnaire.questions.length === 0) {
      throw new Error('Cannot publish empty questionnaire')
    }

    return {
      ...questionnaire,
      status: 'PUBLISHED',
      published_at: new Date().toISOString(),
    }
  }

  /*
    Close questionnaire (stop accepting responses)
   */
  static closeQuestionnaire(questionnaire) {
    return {
      ...questionnaire,
      status: 'CLOSED',
      closed_at: new Date().toISOString(),
    }
  }

  /*
    Record an answer
   */
  static recordAnswer(questionnaireId, questionId, userId, value, anonymous = false) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      questionnaire_id: questionnaireId,
      question_id: questionId,
      user_id: anonymous ? null : userId,
      value,
      answered_at: new Date().toISOString(),
    }
  }

  /*
    Calculate statistics for a question
   */
  static calculateQuestionStats(question, answers) {
    const questionAnswers = answers.filter(a => a.question_id === question.id)

    if (question.type === this.QUESTION_TYPES.LIKERT || question.type === this.QUESTION_TYPES.RATING) {
      return this.calculateNumericStats(questionAnswers, question.options)
    } else if (question.type === this.QUESTION_TYPES.MULTIPLE_CHOICE) {
      return this.calculateChoiceStats(questionAnswers, question.options)
    } else if (question.type === this.QUESTION_TYPES.OPEN_TEXT) {
      return this.calculateTextStats(questionAnswers)
    }

    return {}
  }

  /*
    Calculate statistics for numeric questions (Likert, Rating)
   */
  static calculateNumericStats(answers, options) {
    const values = answers.map(a => a.value).filter(v => typeof v === 'number')

    if (values.length === 0) {
      return {
        total_responses: 0,
        average: 0,
        median: 0,
        distribution: {},
      }
    }

    const sum = values.reduce((a, b) => a + b, 0)
    const average = (sum / values.length).toFixed(2)
    const sorted = [...values].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]

    // Distribution
    const distribution = {}
    options.forEach(opt => {
      distribution[opt.value] = values.filter(v => v === opt.value).length
    })

    return {
      total_responses: values.length,
      average: parseFloat(average),
      median,
      distribution,
      min: Math.min(...values),
      max: Math.max(...values),
    }
  }

  /*
   Calculate statistics for multiple choice questions
   */
  static calculateChoiceStats(answers, options) {
    const distribution = {}
    options.forEach(opt => {
      distribution[opt.label] = answers.filter(a => a.value === opt.value).length
    })

    return {
      total_responses: answers.length,
      distribution,
    }
  }

  /*
    Calculate statistics for open text questions
   */
  static calculateTextStats(answers) {
    return {
      total_responses: answers.length,
      responses: answers.map(a => a.value),
    }
  }

  /*
    Generate evaluation report
   */
  static generateReport(questionnaire, answers) {
    const report = {
      questionnaire_id: questionnaire.id,
      title: questionnaire.title,
      total_responses: new Set(answers.map(a => a.user_id)).size,
      questions: [],
      generated_at: new Date().toISOString(),
    }

    questionnaire.questions.forEach(question => {
      const stats = this.calculateQuestionStats(question, answers)
      report.questions.push({
        question_id: question.id,
        question_text: question.text,
        question_type: question.type,
        ...stats,
      })
    })

    return report
  }

  /*
    Generate satisfaction metrics
   */
  static generateSatisfactionMetrics(questionnaires, answers) {
    const metrics = {
      overall_satisfaction: 0,
      by_workshop: {},
      by_dimension: {},
      generated_at: new Date().toISOString(),
    }

    questionnaires.forEach(questionnaire => {
      const qAnswers = answers.filter(a => a.questionnaire_id === questionnaire.id)
      const report = this.generateReport(questionnaire, qAnswers)

      // Calculate overall satisfaction
      const likertQuestions = report.questions.filter(q => q.question_type === this.QUESTION_TYPES.LIKERT)
      if (likertQuestions.length > 0) {
        const avgSatisfaction = likertQuestions.reduce((sum, q) => sum + q.average, 0) / likertQuestions.length
        metrics.by_workshop[questionnaire.workshop_id] = {
          satisfaction: parseFloat(avgSatisfaction.toFixed(2)),
          responses: report.total_responses,
        }
      }
    })

    // Calculate overall satisfaction
    const workshops = Object.values(metrics.by_workshop)
    if (workshops.length > 0) {
      metrics.overall_satisfaction = parseFloat(
        (workshops.reduce((sum, w) => sum + w.satisfaction, 0) / workshops.length).toFixed(2)
      )
    }

    return metrics
  }

  /*
    Export evaluation results to CSV
   */
  static exportToCSV(questionnaire, answers) {
    let csv = `Questionnaire: ${questionnaire.title}\n`
    csv += `Generated: ${new Date().toISOString()}\n\n`

    // Header
    csv += 'Question,Type,Total Responses,Average,Median\n'

    // Data
    questionnaire.questions.forEach(question => {
      const stats = this.calculateQuestionStats(question, answers)
      csv += `"${question.text}",${question.type},${stats.total_responses || 0},${stats.average || 'N/A'},${stats.median || 'N/A'}\n`
    })

    return csv
  }

  /*
    Create default post-workshop questionnaire
   */
  static createDefaultPostWorkshopQuestionnaire(workshopId) {
    let q = this.createQuestionnaire(
      'Avaluació del Taller',
      'Gràcies per participar. Ajuda\'ns a millorar completant aquesta breu avaluació.',
      workshopId,
      true // Anonymous
    )

    q = this.createLikertQuestion(q, 'El contingut del taller va ser rellevant i útil', 5)
    q = this.createLikertQuestion(q, 'Els professors van explicar de manera clara', 5)
    q = this.createLikertQuestion(q, 'La durada del taller va ser adequada', 5)
    q = this.createLikertQuestion(q, 'Els materials i recursos van ser de qualitat', 5)
    q = this.createRatingQuestion(q, 'Puntuació general del taller', 5)
    q = this.createOpenTextQuestion(q, 'Quina és la millor cosa que has après?', false)
    q = this.createOpenTextQuestion(q, 'Quina és una cosa que podríem millorar?', false)

    return q
  }
}

export default EvaluationService
