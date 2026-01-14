/*
  API Service
  Centralized API communication with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class APIService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /*
    Generic fetch wrapper
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message)
      throw error
    }
  }

  /*
    POST /register
    Register a new user
   */
  register(email, password, fullName, role, organizationName = '') {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        fullName,
        role,
        organizationName,
      }),
    })
  }

  /*
    POST /verify
    Verify email with code
   */
  verifyEmail(email, code) {
    return this.request('/verify', {
      method: 'POST',
      body: JSON.stringify({
        email,
        code,
      }),
    })
  }

  /*
    POST /resend-code
    Resend verification code
   */
  resendCode(email) {
    return this.request('/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  /*
    POST /login
    Login user
   */
  login(email, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })
  }

  /*
    GET /health
    Check if server is running
   */
  health() {
    return this.request('/health', {
      method: 'GET',
    })
  }

  /*
    Clear auth token
   */
  clearToken() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  /*
    Save auth token
   */
  saveToken(token, user) {
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  /*
    Get stored user
   */
  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  /*
    Get auth token
   */
  getToken() {
    return localStorage.getItem('authToken')
  }

  /*
    Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken()
  }
}

export default new APIService()
