import apiClient from './client'
import type { User, Admin } from '../types'
import { mockSignIn, mockSignOut, mockSignUp } from './mock/handlers'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

export const signIn = async (email: string, password: string) => {
  if (DEMO) return mockSignIn(email, password)
  const res = await apiClient.post<{ user: User }>('/auth/sign_in', {
    user: { email, password },
  })
  const token = res.headers['authorization']?.replace('Bearer ', '') ?? ''
  return { user: res.data.user, token }
}

export const signUp = async (data: {
  email: string
  password: string
  password_confirmation: string
  name: string
  phone?: string
}) => {
  if (DEMO) return mockSignUp(data)
  const res = await apiClient.post<{ user: User }>('/auth/sign_up', { user: data })
  const token = res.headers['authorization']?.replace('Bearer ', '') ?? ''
  return { user: res.data.user, token }
}

export const signOut = async () => {
  if (DEMO) return mockSignOut()
  await apiClient.delete('/auth/sign_out')
}

export const adminSignIn = async (email: string, password: string) => {
  const res = await apiClient.post<{ admin: Admin }>('/admin/auth/sign_in', {
    admin: { email, password },
  })
  const token = res.headers['authorization']?.replace('Bearer ', '') ?? ''
  return { admin: res.data.admin, token }
}
