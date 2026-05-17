import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, CreditCard, MapPin, ShoppingBag } from 'lucide-react'
import { getCart } from '../api/cart'
import { createOrder, createPayment } from '../api/orders'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import type { Cart, Order } from '../types'
import Button from '../components/ui/Button'

type Step = 'shipping' | 'payment' | 'complete'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { setCart } = useCartStore()
  const [cart, setLocalCart] = useState<Cart | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [step, setStep] = useState<Step>('shipping')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [shippingData, setShippingData] = useState({
    shipping_name: '',
    shipping_postal_code: '',
    shipping_address: '',
  })

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login', { state: { from: '/checkout' } }); return }
    getCart().then(setLocalCart).catch(() => navigate('/'))
  }, [isAuthenticated])

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
        <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>カートが空です</p>
        <Button className="mt-4" onClick={() => navigate('/')}>ショッピングを続ける</Button>
      </div>
    )
  }

  const handleShippingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)
    try {
      const createdOrder = await createOrder(shippingData)
      setOrder(createdOrder)
      setCart({ ...cart!, items: [], item_count: 0, total: 0 })
      setStep('payment')
    } catch (err: any) {
      setErrors(err.response?.data?.errors ?? ['注文の作成に失敗しました'])
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!order) return
    setLoading(true)
    try {
      await createPayment(order.id)
      setStep('complete')
    } catch {
      setErrors(['お支払いに失敗しました'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {(['shipping', 'payment', 'complete'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step === s ? 'bg-indigo-600 text-white' : i < ['shipping', 'payment', 'complete'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i < ['shipping', 'payment', 'complete'].indexOf(step) ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${step === s ? 'text-indigo-600' : 'text-gray-400'}`}>
              {['配送先', 'お支払い', '完了'][i]}
            </span>
            {i < 2 && <div className="w-8 h-px bg-gray-300 mx-1" />}
          </div>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      {/* Shipping Step */}
      {step === 'shipping' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">配送先情報</h2>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">注文内容</h3>
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm py-1">
                <span className="text-gray-700">{item.product.name} × {item.quantity}</span>
                <span className="font-medium">¥{item.subtotal.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
              <span>合計</span>
              <span className="text-indigo-600">¥{cart.total.toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">お届け先のお名前 <span className="text-red-500">*</span></label>
              <input type="text" required value={shippingData.shipping_name} onChange={(e) => setShippingData(d => ({ ...d, shipping_name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="山田 太郎" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">郵便番号 <span className="text-red-500">*</span></label>
              <input type="text" required value={shippingData.shipping_postal_code} onChange={(e) => setShippingData(d => ({ ...d, shipping_postal_code: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">住所 <span className="text-red-500">*</span></label>
              <input type="text" required value={shippingData.shipping_address} onChange={(e) => setShippingData(d => ({ ...d, shipping_address: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="東京都渋谷区..." />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              お支払い画面へ
            </Button>
          </form>
        </div>
      )}

      {/* Payment Step */}
      {step === 'payment' && order && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">お支払い</h2>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
            ※ これはモック決済です。実際の課金は行われません。
          </div>

          {/* Mock Card Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カード番号</label>
              <input type="text" defaultValue="4242 4242 4242 4242" readOnly className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">有効期限</label>
                <input type="text" defaultValue="12/28" readOnly className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">セキュリティコード</label>
                <input type="text" defaultValue="123" readOnly className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm mb-6">
            <span className="text-gray-600">合計金額</span>
            <span className="text-xl font-bold text-indigo-600">¥{order.total.toLocaleString()}</span>
          </div>

          <Button className="w-full" size="lg" loading={loading} onClick={handlePayment}>
            ¥{order.total.toLocaleString()} を支払う
          </Button>
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && order && (
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ご注文ありがとうございます！</h2>
          <p className="text-gray-600 mb-1">注文番号: #{order.id}</p>
          <p className="text-sm text-gray-500 mb-8">配送先: {order.shipping_address}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/orders')}>注文履歴を見る</Button>
            <Button onClick={() => navigate('/')}>ショッピングを続ける</Button>
          </div>
        </div>
      )}
    </div>
  )
}
