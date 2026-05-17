import apiClient from './client'
import type { Cart } from '../types'

export const getCart = async () => {
  const res = await apiClient.get<{ cart: Cart }>('/cart')
  return res.data.cart
}

export const addToCart = async (productId: number, quantity: number = 1) => {
  const res = await apiClient.post<{ cart: Cart }>('/cart/cart_items', {
    product_id: productId,
    quantity,
  })
  return res.data.cart
}

export const updateCartItem = async (itemId: number, quantity: number) => {
  const res = await apiClient.patch<{ cart: Cart }>(`/cart/cart_items/${itemId}`, { quantity })
  return res.data.cart
}

export const removeCartItem = async (itemId: number) => {
  const res = await apiClient.delete<{ cart: Cart }>(`/cart/cart_items/${itemId}`)
  return res.data.cart
}
