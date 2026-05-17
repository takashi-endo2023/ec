import apiClient from './client'
import type { Order, Payment, PaginationMeta } from '../types'
import {
  mockGetOrders,
  mockGetOrder,
  mockCreateOrder,
  mockCreatePayment,
} from './mock/handlers'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

export const getOrders = async (page = 1) => {
  if (DEMO) return mockGetOrders(page)
  const res = await apiClient.get<{ orders: Order[]; meta: PaginationMeta }>('/orders', {
    params: { page },
  })
  return res.data
}

export const getOrder = async (id: number) => {
  if (DEMO) return mockGetOrder(id)
  const res = await apiClient.get<{ order: Order }>(`/orders/${id}`)
  return res.data.order
}

export const createOrder = async (data: {
  shipping_name: string
  shipping_postal_code: string
  shipping_address: string
}) => {
  if (DEMO) return mockCreateOrder(data)
  const res = await apiClient.post<{ order: Order }>('/orders', { order: data })
  return res.data.order
}

export const createPayment = async (orderId: number) => {
  if (DEMO) return mockCreatePayment(orderId)
  const res = await apiClient.post<{ payment: Payment; order: Order }>('/payments', {
    order_id: orderId,
    payment_method: 'mock_credit_card',
  })
  return res.data
}
