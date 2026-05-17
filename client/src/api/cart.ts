import apiClient from './client'
import type { Cart } from '../types'
import {
  mockGetCart,
  mockAddToCart,
  mockUpdateCartItem,
  mockRemoveCartItem,
} from './mock/handlers'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

export const getCart = async () => {
  if (DEMO) return mockGetCart()
  const res = await apiClient.get<{ cart: Cart }>('/cart')
  return res.data.cart
}

export const addToCart = async (productId: number, quantity: number = 1) => {
  if (DEMO) return mockAddToCart(productId, quantity)
  const res = await apiClient.post<{ cart: Cart }>('/cart/cart_items', {
    product_id: productId,
    quantity,
  })
  return res.data.cart
}

export const updateCartItem = async (itemId: number, quantity: number) => {
  if (DEMO) return mockUpdateCartItem(itemId, quantity)
  const res = await apiClient.patch<{ cart: Cart }>(`/cart/cart_items/${itemId}`, { quantity })
  return res.data.cart
}

export const removeCartItem = async (itemId: number) => {
  if (DEMO) return mockRemoveCartItem(itemId)
  const res = await apiClient.delete<{ cart: Cart }>(`/cart/cart_items/${itemId}`)
  return res.data.cart
}
