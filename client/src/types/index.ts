export interface User {
  id: number
  name: string
  email: string
  phone?: string
  gender?: string
  birth_day?: string
  postal_code?: string
  prefecture?: string
  municipality?: string
  address?: string
  building?: string
}

export interface Admin {
  id: number
  name: string
  email: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  image_url?: string
  in_stock: boolean
  created_at: string
}

export interface CartItem {
  id: number
  quantity: number
  subtotal: number
  product: Pick<Product, 'id' | 'name' | 'price' | 'stock' | 'image_url'>
}

export interface Cart {
  id: number
  total: number
  item_count: number
  items: CartItem[]
}

export interface OrderItem {
  id: number
  quantity: number
  price_at_purchase: number
  subtotal: number
  product: Pick<Product, 'id' | 'name' | 'image_url'>
}

export interface Order {
  id: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  status_label: string
  total: number
  ordered_at: string
  shipping_name: string
  shipping_postal_code: string
  shipping_address: string
  payment_status?: string
  items?: OrderItem[]
}

export interface Payment {
  id: number
  status: string
  amount: number
  transaction_id: string
}

export interface PaginationMeta {
  current_page: number
  total_pages: number
  total_count: number
}

export interface ApiError {
  error?: string
  errors?: string[]
}
