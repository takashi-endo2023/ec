import type { Cart, CartItem } from '../../types'
import { DEMO_USER, MOCK_ORDERS, MOCK_PRODUCTS } from './data'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// ---------- Auth ----------

export const mockSignIn = async (_email: string, _password: string) => {
  await delay()
  return { user: DEMO_USER, token: 'demo-token' }
}

export const mockSignUp = async (_data: unknown) => {
  await delay()
  return { user: DEMO_USER, token: 'demo-token' }
}

export const mockSignOut = async () => {
  await delay(200)
}

// ---------- Products ----------

export const mockGetProducts = async (params?: {
  keyword?: string
  category?: string
  page?: number
  per?: number
  include_out_of_stock?: boolean
}) => {
  await delay()
  let results = [...MOCK_PRODUCTS]

  if (!params?.include_out_of_stock) {
    // include out_of_stock items still but keep them, just like the real API
  }
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase()
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.description?.toLowerCase().includes(kw) ||
        p.category?.toLowerCase().includes(kw)
    )
  }
  if (params?.category) {
    results = results.filter((p) => p.category === params.category)
  }

  const per = params?.per ?? 12
  const page = params?.page ?? 1
  const total_count = results.length
  const total_pages = Math.ceil(total_count / per) || 1
  const paginated = results.slice((page - 1) * per, page * per)

  return {
    products: paginated,
    meta: { current_page: page, total_pages, total_count },
  }
}

export const mockGetProduct = async (id: number) => {
  await delay()
  const product = MOCK_PRODUCTS.find((p) => p.id === id)
  if (!product) throw new Error('Product not found')
  return product
}

// ---------- Cart (in-memory) ----------

let cartState: Cart = {
  id: 1,
  total: 0,
  item_count: 0,
  items: [],
}
let nextItemId = 100

function recalc(cart: Cart): Cart {
  cart.total = cart.items.reduce((sum, item) => sum + item.subtotal, 0)
  cart.item_count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  return { ...cart, items: [...cart.items] }
}

export const mockGetCart = async (): Promise<Cart> => {
  await delay(200)
  return recalc(cartState)
}

export const mockAddToCart = async (productId: number, quantity: number): Promise<Cart> => {
  await delay()
  const product = MOCK_PRODUCTS.find((p) => p.id === productId)
  if (!product) throw new Error('Product not found')

  const existing = cartState.items.find((item) => item.product.id === productId)
  if (existing) {
    existing.quantity += quantity
    existing.subtotal = existing.quantity * product.price
  } else {
    const newItem: CartItem = {
      id: nextItemId++,
      quantity,
      subtotal: quantity * product.price,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        image_url: product.image_url,
      },
    }
    cartState.items.push(newItem)
  }
  return recalc(cartState)
}

export const mockUpdateCartItem = async (itemId: number, quantity: number): Promise<Cart> => {
  await delay()
  if (quantity <= 0) {
    cartState.items = cartState.items.filter((i) => i.id !== itemId)
  } else {
    const item = cartState.items.find((i) => i.id === itemId)
    if (item) {
      item.quantity = quantity
      item.subtotal = quantity * item.product.price
    }
  }
  return recalc(cartState)
}

export const mockRemoveCartItem = async (itemId: number): Promise<Cart> => {
  await delay()
  cartState.items = cartState.items.filter((i) => i.id !== itemId)
  return recalc(cartState)
}

export const mockClearCart = () => {
  cartState = { id: 1, total: 0, item_count: 0, items: [] }
}

// ---------- Orders ----------

let mockOrdersStore = [...MOCK_ORDERS]
let nextOrderId = 10

export const mockGetOrders = async (page = 1) => {
  await delay()
  const per = 10
  const total_count = mockOrdersStore.length
  const total_pages = Math.ceil(total_count / per) || 1
  return {
    orders: mockOrdersStore.slice((page - 1) * per, page * per),
    meta: { current_page: page, total_pages, total_count },
  }
}

export const mockGetOrder = async (id: number) => {
  await delay()
  const order = mockOrdersStore.find((o) => o.id === id)
  if (!order) throw new Error('Order not found')
  return order
}

export const mockCreateOrder = async (data: {
  shipping_name: string
  shipping_postal_code: string
  shipping_address: string
}) => {
  await delay(600)
  const items = cartState.items.map((item, i) => ({
    id: i + 1,
    quantity: item.quantity,
    price_at_purchase: item.product.price,
    subtotal: item.subtotal,
    product: { id: item.product.id, name: item.product.name, image_url: item.product.image_url },
  }))
  const order = {
    id: nextOrderId++,
    status: 'pending' as const,
    status_label: '注文受付',
    total: cartState.total,
    ordered_at: new Date().toISOString(),
    payment_status: 'unpaid',
    items,
    ...data,
  }
  mockOrdersStore = [order, ...mockOrdersStore]
  mockClearCart()
  return order
}

export const mockCreatePayment = async (orderId: number) => {
  await delay(800)
  const order = mockOrdersStore.find((o) => o.id === orderId)
  if (!order) throw new Error('Order not found')
  order.payment_status = 'paid'
  order.status = 'processing'
  order.status_label = '処理中'
  const payment = {
    id: 1,
    status: 'paid',
    amount: order.total,
    transaction_id: `DEMO-${Date.now()}`,
  }
  return { payment, order: { ...order } }
}
