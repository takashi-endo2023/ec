import apiClient from './client'
import type { Product, PaginationMeta } from '../types'
import {
  mockGetProducts,
  mockGetProduct,
} from './mock/handlers'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

interface ProductsParams {
  keyword?: string
  category?: string
  page?: number
  per?: number
  include_out_of_stock?: boolean
}

export const getProducts = async (params?: ProductsParams) => {
  if (DEMO) return mockGetProducts(params)
  const res = await apiClient.get<{ products: Product[]; meta: PaginationMeta }>(
    '/products',
    { params }
  )
  return res.data
}

export const getProduct = async (id: number) => {
  if (DEMO) return mockGetProduct(id)
  const res = await apiClient.get<{ product: Product }>(`/products/${id}`)
  return res.data.product
}

// Admin
export const adminCreateProduct = async (data: FormData) => {
  const res = await apiClient.post<{ product: Product }>('/admin/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.product
}

export const adminUpdateProduct = async (id: number, data: FormData) => {
  const res = await apiClient.patch<{ product: Product }>(`/admin/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.product
}

export const adminDeleteProduct = async (id: number) => {
  await apiClient.delete(`/admin/products/${id}`)
}
