import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ShoppingBag, Plus, Pencil, Trash2 } from 'lucide-react'
import apiClient from '../../api/client'
import { adminDeleteProduct } from '../../api/products'
import { useAuthStore } from '../../stores/authStore'
import type { Product, Order } from '../../types'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

type Tab = 'products' | 'orders'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { isAdmin } = useAuthStore()
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    if (!isAdmin) { navigate('/admin/login'); return }
    Promise.all([
      apiClient.get<{ products: Product[] }>('/admin/products'),
      apiClient.get<{ orders: Order[] }>('/admin/orders'),
    ]).then(([p, o]) => {
      setProducts(p.data.products)
      setOrders(o.data.orders)
    })
  }, [isAdmin])

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('この商品を削除しますか？')) return
    await adminDeleteProduct(id)
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    await apiClient.patch(`/admin/orders/${orderId}`, { status })
    setOrders(orders.map((o) => o.id === orderId ? { ...o, status: status as Order['status'] } : o))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h1>
        <div className="flex gap-3 text-sm">
          <div className="bg-white border rounded-xl px-4 py-3 text-center">
            <div className="text-2xl font-bold text-indigo-600">{products.length}</div>
            <div className="text-gray-500 flex items-center gap-1"><Package className="w-3.5 h-3.5" />商品数</div>
          </div>
          <div className="bg-white border rounded-xl px-4 py-3 text-center">
            <div className="text-2xl font-bold text-indigo-600">{orders.length}</div>
            <div className="text-gray-500 flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5" />注文数</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {(['products', 'orders'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            {t === 'products' ? '商品管理' : '注文管理'}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={() => navigate('/admin/products/new')}>
              <Plus className="w-4 h-4" />
              新規商品追加
            </Button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['商品名', 'カテゴリ', '価格', '在庫', '操作'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-300 m-auto mt-2.5" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-sm text-gray-500">{product.category ?? '−'}</span></td>
                    <td className="px-4 py-3"><span className="text-sm font-medium text-gray-900">¥{product.price.toLocaleString()}</span></td>
                    <td className="px-4 py-3">
                      <Badge variant={product.stock > 0 ? 'success' : 'danger'}>{product.stock}個</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/admin/products/${product.id}/edit`)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['注文ID', '顧客', '合計', '注文日', 'ステータス', '操作'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{order.shipping_name}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">¥{order.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.ordered_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={({ pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger' } as const)[order.status] ?? 'default'}>
                      {order.status_label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
