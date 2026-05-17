import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Package, ArrowLeft } from 'lucide-react'
import { getProduct } from '../api/products'
import { addToCart } from '../api/cart'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import type { Product } from '../types'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

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
      <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        戻る
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <Package className="w-24 h-24" />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <Badge className="mb-3">{product.category}</Badge>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-3xl font-bold text-indigo-600 mb-4">¥{product.price.toLocaleString()}</p>

          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
          )}

          <div className="flex items-center gap-2 mb-4 text-sm">
            {product.in_stock ? (
              <span className="text-green-600 font-medium">● 在庫あり（残り{product.stock}点）</span>
            ) : (
              <span className="text-red-500 font-medium">● 在庫切れ</span>
            )}
          </div>

          {product.in_stock && (
            <div className="flex items-center gap-3 mb-6">
              <label className="text-sm font-medium text-gray-700">数量:</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 transition-colors">−</button>
                <span className="px-4 py-2 text-sm font-medium border-x border-gray-300">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-100 transition-colors">+</button>
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
            className="w-full"
            disabled={!product.in_stock}
            loading={adding}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
            {product.in_stock ? 'カートに追加' : '在庫切れ'}
          </Button>
        </div>
      </div>
    </div>
  )
}
