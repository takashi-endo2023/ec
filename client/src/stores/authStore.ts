import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  setAuth: (user: User, token: string) => void
  setAdminAuth: (token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      setAuth: (user, token) => {
        localStorage.removeItem('admin_token')
        localStorage.setItem('auth_token', token)
        set({ user, token, isAuthenticated: true, isAdmin: false })
      },

      setAdminAuth: (token) => {
        localStorage.removeItem('auth_token')
        localStorage.setItem('admin_token', token)
        set({ user: null, token, isAuthenticated: true, isAdmin: true })
      },

      clearAuth: () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('admin_token')
        set({ user: null, token: null, isAuthenticated: false, isAdmin: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
)
