/** Servicio de Reconocimiento de Voz
  Configura la Web Speech API para convertir voz en texto y ejecutar comandos.
*/

export class VoiceService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    this.recognition = new SpeechRecognition()
    this.isListening = false
    this.transcript = ''
    this.isFinal = false
    this.setupRecognition()
  }

  /** Configuración inicial: idioma catalán y resultados en tiempo real. */
  setupRecognition() {
    this.recognition.continuous = false
    this.recognition.interimResults = true
    this.recognition.lang = 'ca-ES' // Configurado para ENGINY (Cataluña)

    this.recognition.onstart = () => {
      this.isListening = true
    }

    this.recognition.onend = () => {
      this.isListening = false
    }

    this.recognition.onerror = (event) => {
      console.error('Error en el reconocimiento:', event.error)
    }
  }

  /** Activa el micro y gestiona los resultados parciales y finales. */
  startListening(onResult, onFinal) {
    this.transcript = ''
    this.isFinal = false

    this.recognition.onresult = (event) => {
      this.transcript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        this.transcript += transcript

        if (event.results[i].isFinal) {
          this.isFinal = true
        }
      }

      if (onResult) {
        onResult({
          transcript: this.transcript,
          isFinal: this.isFinal,
          confidence: event.results[event.results.length - 1][0].confidence,
        })
      }

      if (this.isFinal && onFinal) {
        onFinal(this.transcript)
      }
    }

    this.recognition.start()
  }

  /** Detiene la escucha de forma manual. */
  stopListening() {
    this.recognition.stop()
  }

  /** Diccionario de comandos: traduce lo que el usuario dice en acciones de la app. */
  processCommand(text) {
    const command = text.toLowerCase().trim()

    const commands = {
      'anar a peticions': { action: 'navigate', route: '/centre/peticions' },
      'peticions': { action: 'navigate', route: '/centre/peticions' },
      'anar al catàleg': { action: 'navigate', route: '/centre/cataleg' },
      'catàleg': { action: 'navigate', route: '/centre/cataleg' },
      'cercar taller': { action: 'search', target: 'workshops' },
      'cercar': { action: 'search', target: 'workshops' },
      'anar a tallers': { action: 'navigate', route: '/admin/tallers' },
      'tallers': { action: 'navigate', route: '/admin/tallers' },
      'anar a professors': { action: 'navigate', route: '/admin/professors' },
      'professors': { action: 'navigate', route: '/admin/professors' },
      'anar a informes': { action: 'navigate', route: '/admin/informes' },
      'informes': { action: 'navigate', route: '/admin/informes' },
      'anar a casa': { action: 'navigate', route: '/' },
      'casa': { action: 'navigate', route: '/' },
      'tancar sessió': { action: 'logout' },
      'sortir': { action: 'logout' },
      'ajuda': { action: 'help' },
      'notificacions': { action: 'navigate', route: '/notifications' },
      'anar a notificacions': { action: 'navigate', route: '/notifications' },
    }

    for (const [key, value] of Object.entries(commands)) {
      if (command.includes(key)) {
        return value
      }
    }

    return null
  }

  /** Lista para mostrar al usuario qué puede decir. */
  getAvailableCommands() {
    return [
      { command: 'Anar a peticions', description: 'Navega a la secció de peticions' },
      { command: 'Anar al catàleg', description: 'Navega al catàleg de tallers' },
      { command: 'Cercar taller', description: 'Obre la cerca de tallers' },
      { command: 'Anar a tallers', description: 'Navega a la gestió de tallers (admin)' },
      { command: 'Anar a professors', description: 'Navega a la gestió de professors (admin)' },
      { command: 'Anar a informes', description: 'Navega als informes (admin)' },
      { command: 'Anar a casa', description: 'Torna a la pàgina principal' },
      { command: 'Notificacions', description: 'Mostra les notificacions' },
      { command: 'Tancar sessió', description: 'Tanca la sessió actual' },
      { command: 'Ajuda', description: 'Mostra aquesta llista de comandaments' },
    ]
  }

  /** Verifica si el navegador es compatible (Chrome/Edge sí, otros depende). */
  static isSupported() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    return !!SpeechRecognition
  }

  /** Listado de idiomas que el motor de voz entiende. */
  static getSupportedLanguages() {
    return [
      { code: 'ca-ES', name: 'Català' },
      { code: 'es-ES', name: 'Español' },
      { code: 'en-US', name: 'English' },
      { code: 'fr-FR', name: 'Français' },
      { code: 'de-DE', name: 'Deutsch' },
    ]
  }

  /** Cambia el idioma de escucha dinámicamente. */
  setLanguage(langCode) {
    this.recognition.lang = langCode
  }
}

export default VoiceService