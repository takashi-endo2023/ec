import { Link } from 'react-router-dom'
import { ShoppingCart, Package } from 'lucide-react'
import type { Product } from '../../types'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import { addToCart } from '../../api/cart'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuthStore()
  const { setCart, openCart } = useCartStore()
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    setAdding(true)
    try {
      const cart = await addToCart(product.id, 1)
      setCart(cart)
      openCart()
    } catch (err) {
      console.error(err)
    } finally {
      setAdding(false)
    }
  }

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-100">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <Package className="w-16 h-16" />
            </div>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">在庫切れ</span>
            </div>
          )}
          {product.category && (
            <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
          {product.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <p className="text-lg font-bold text-indigo-600">
              ¥{product.price.toLocaleString()}
            </p>
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock || adding}
              className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {adding ? '追加中...' : 'カートへ'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
