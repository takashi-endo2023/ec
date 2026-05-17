import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Package, ArrowLeft, Minus, Plus } from 'lucide-react'
import { getProduct } from '../api/products'
import { addToCart } from '../api/cart'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import type { Product } from '../types'
import Button from '../components/ui/Button'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { setCart, openCart } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [cartError, setCartError] = useState<string | null>(null)

  useEffect(() => {
    getProduct(Number(id))
      .then(setProduct)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: `/products/${id}` } }); return }
    setCartError(null)
    setAdding(true)
    try {
      const cart = await addToCart(Number(id), quantity)
      setCart(cart)
      openCart()
    } catch (err: any) {
      setCartError(err.response?.data?.error ?? 'エラーが発生しました')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-[#e8e3da] rounded-2xl" />
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-[#e8e3da] rounded w-1/4" />
            <div className="h-8 bg-[#e8e3da] rounded w-3/4" />
            <div className="h-6 bg-[#e8e3da] rounded w-1/3" />
            <div className="h-4 bg-[#e8e3da] rounded" />
            <div className="h-4 bg-[#e8e3da] rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[#9a8677] hover:text-[#1a1410] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        戻る
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#f3f1ec]">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#d4cbbf]">
              <Package className="w-24 h-24" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-2">
          {product.category && (
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-[#9a8677] mb-3">{product.category}</p>
          )}
          <h1 className="font-serif text-3xl font-bold text-[#1a1410] leading-snug mb-3">{product.name}</h1>
          <p className="text-2xl text-[#5c4d3f] mb-6 font-light">¥{product.price.toLocaleString()}</p>

          {/* Divider */}
          <div className="w-12 h-px bg-[#d4cbbf] mb-6" />

          {product.description && (
            <p className="text-[#5c4d3f] text-sm leading-relaxed mb-8">{product.description}</p>
          )}

          <div className="flex items-center gap-2 mb-6 text-sm">
            {product.in_stock ? (
              <span className="text-emerald-700 text-xs tracking-wide">● 在庫あり（残り{product.stock}点）</span>
            ) : (
              <span className="text-red-500 text-xs tracking-wide">● 在庫切れ</span>
            )}
          </div>

          {product.in_stock && (
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-medium tracking-wide text-[#5c4d3f]">数量</span>
              <div className="flex items-center border border-[#e8e3da] rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2.5 hover:bg-[#f3f1ec] transition-colors text-[#5c4d3f]"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-[#1a1410] border-x border-[#e8e3da] min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-4 py-2.5 hover:bg-[#f3f1ec] transition-colors text-[#5c4d3f]"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {cartError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">
              {cartError}
            </div>
          )}

          <Button
            size="lg"
            className="w-full !bg-[#1a1410] !text-white hover:!bg-[#3d3229] !rounded-full !py-4 !text-sm tracking-wide disabled:!opacity-40"
            disabled={!product.in_stock}
            loading={adding}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.in_stock ? 'カートに追加' : '在庫切れ'}
          </Button>
        </div>
      </div>
    </div>
  )
}
