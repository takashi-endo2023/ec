import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ShoppingCart, Minus, Plus, Trash2, Package } from 'lucide-react'
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
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#faf9f7] z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e3da]">
          <div className="flex items-center gap-2.5 font-medium text-[#1a1410]">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm tracking-wide">ショッピングカート</span>
            {(cart?.item_count ?? 0) > 0 && (
              <span className="bg-[#1a1410] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {cart!.item_count}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-[#f3f1ec] rounded-full transition-colors text-[#9a8677] hover:text-[#1a1410]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#b8a99a] gap-4">
              <ShoppingCart className="w-10 h-10 opacity-40" />
              <p className="text-sm">カートに商品がありません</p>
            </div>
          ) : (
            <ul className="space-y-5">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-4 pb-5 border-b border-[#f3f1ec] last:border-0">
                  {/* Image */}
                  <div className="w-20 h-20 bg-[#f3f1ec] rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#d4cbbf]">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a1410] truncate">{item.product.name}</p>
                    <p className="text-sm text-[#9a8677] mt-0.5 font-light">
                      ¥{item.product.price.toLocaleString()}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#e8e3da] rounded-full overflow-hidden">
                        <button
                          onClick={() => handleUpdate(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#f3f1ec] transition-colors text-[#5c4d3f]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-medium text-[#1a1410]">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdate(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#f3f1ec] transition-colors text-[#5c4d3f] disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 text-[#b8a99a] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          <div className="border-t border-[#e8e3da] px-6 py-5 space-y-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#9a8677]">小計</span>
              <span className="font-semibold text-[#1a1410]">¥{cart.total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-[#b8a99a]">送料は注文確定時に計算されます</p>
            <Button
              className="w-full !bg-[#1a1410] !text-white hover:!bg-[#3d3229] !rounded-full !py-3.5 !text-sm tracking-wide"
              size="lg"
              onClick={handleCheckout}
            >
              レジに進む
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
