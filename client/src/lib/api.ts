import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach JWT token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('mp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mp_token')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/'
      }
    }
    return Promise.reject(err)
  }
)

export default api
