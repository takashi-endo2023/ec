import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'
import { getCart, updateCartItem, removeCartItem } from '../../api/cart'
import Button from '../ui/Button'

export default function CartDrawer() {
  const { cart, isOpen, closeCart, setCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      getCart().then(setCart).catch(console.error)
    }
  }, [isOpen, isAuthenticated])

  const handleUpdate = async (itemId: number, quantity: number) => {
    const updated = await updateCartItem(itemId, quantity)
    setCart(updated)
  }

  const handleRemove = async (itemId: number) => {
    const updated = await removeCartItem(itemId)
    setCart(updated)
  }

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <ShoppingCart className="w-5 h-5" />
            カート
            {(cart?.item_count ?? 0) > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart!.item_count}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <ShoppingCart className="w-12 h-12 opacity-30" />
              <p className="text-sm">カートに商品がありません</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
                  {/* Image */}
                  <div className="w-18 h-18 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-sm text-indigo-600 font-semibold mt-0.5">
                      ¥{item.product.price.toLocaleString()}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdate(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdate(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">小計</span>
              <span className="font-semibold text-gray-900">¥{cart.total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500">送料は注文確定時に計算されます</p>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              レジに進む
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
