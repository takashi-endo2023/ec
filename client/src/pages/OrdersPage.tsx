import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import { getOrders } from '../api/orders'
import { useAuthStore } from '../stores/authStore'
import type { Order } from '../types'
import Badge from '../components/ui/Badge'

const statusVariants: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    getOrders().then((data) => setOrders(data.orders)).finally(() => setLoading(false))
  }, [isAuthenticated])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">注文履歴</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="mb-4">注文履歴がありません</p>
          <Link to="/" className="text-indigo-600 hover:underline text-sm">ショッピングを始める</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="block bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">注文 #{order.id}</span>
                    <Badge variant={statusVariants[order.status] ?? 'default'}>{order.status_label}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.ordered_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">お届け先: {order.shipping_address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600">¥{order.total.toLocaleString()}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
