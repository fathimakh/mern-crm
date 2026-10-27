import axios from 'axios'

export const TOKEN_KEY = 'crm_token'
export const SESSION_EXPIRED_EVENT = 'crm:session-expired'

// Base URL of the Express API (set VITE_API_URL in the project-root .env)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5014/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If an authenticated request comes back 401 the token is invalid/expired:
// clear it and let the AuthContext send the user back to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentToken = Boolean(error.config?.headers?.Authorization)
    if (error.response?.status === 401 && sentToken) {
      localStorage.removeItem(TOKEN_KEY)
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
    }
    return Promise.reject(error)
  },
)

export default api
