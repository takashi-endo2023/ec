import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Settings, Package } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import { signOut } from '../../api/auth'

export default function Header() {
  const { isAuthenticated, isAdmin, user, clearAuth } = useAuthStore()
  const { cart, toggleCart } = useCartStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
    } finally {
      clearAuth()
      navigate('/')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Package className="w-6 h-6" />
            EC Shop
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="商品を検索..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/?keyword=${(e.target as HTMLInputElement).value}`)
                  }
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated && !isAdmin && (
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {(cart?.item_count ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart!.item_count}
                  </span>
                )}
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">管理</span>
                  </Link>
                )}
                {!isAdmin && (
                  <Link
                    to="/profile"
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">ログアウト</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 font-medium"
                >
                  ログイン
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
