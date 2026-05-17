import apiClient from './client'
import type { Order, Payment, PaginationMeta } from '../types'

export const getOrders = async (page = 1) => {
  const res = await apiClient.get<{ orders: Order[]; meta: PaginationMeta }>('/orders', {
    params: { page },
  })
  return res.data
}

export const getOrder = async (id: number) => {
  const res = await apiClient.get<{ order: Order }>(`/orders/${id}`)
  return res.data.order
}

export const createOrder = async (data: {
  shipping_name: string
  shipping_postal_code: string
  shipping_address: string
}) => {
  const res = await apiClient.post<{ order: Order }>('/orders', { order: data })
  return res.data.order
}

export const createPayment = async (orderId: number) => {
  const res = await apiClient.post<{ payment: Payment; order: Order }>('/payments', {
    order_id: orderId,
    payment_method: 'mock_credit_card',
  })
  return res.data
}
