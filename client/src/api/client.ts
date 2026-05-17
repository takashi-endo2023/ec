import axios from 'axios'

const BASE_URL = '/api/v1'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// JWT トークンを自動付与（admin トークンを優先）
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 時に自動ログアウト
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdmin = !!localStorage.getItem('admin_token')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('admin_token')
      localStorage.removeItem('auth-storage')
      window.location.href = isAdmin ? '/admin/login' : '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
