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
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-[#f3f1ec] rounded-xl relative mb-3">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d4cbbf]">
            <Package className="w-12 h-12" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Out of stock overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-[#5c4d3f] text-xs font-medium tracking-widest uppercase">Sold Out</span>
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#5c4d3f] text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full">
            {product.category}
          </span>
        )}

        {/* Add to cart — revealed on hover */}
        {product.in_stock && (
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1410] text-white text-xs font-medium py-2.5 rounded-lg hover:bg-[#3d3229] active:scale-95 transition-all disabled:opacity-60"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {adding ? '追加中...' : 'カートへ追加'}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="text-sm font-medium text-[#1a1410] truncate leading-snug">{product.name}</h3>
        <p className="text-sm text-[#5c4d3f] mt-1 font-light">¥{product.price.toLocaleString()}</p>
      </div>
    </Link>
  )
}
