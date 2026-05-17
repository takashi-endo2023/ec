import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import { signOut } from '../../api/auth'
import { useEffect, useState } from 'react'

export default function Header() {
  const { isAuthenticated, isAdmin, user, clearAuth } = useAuthStore()
  const { cart, toggleCart } = useCartStore()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } finally {
      clearAuth()
      navigate('/')
    }
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
        : 'bg-[#faf9f7] border-b border-[#e8e3da]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <span className="font-serif text-xl font-bold tracking-tight text-[#1a1410]">MAISON</span>
            <span className="font-serif text-xl font-light tracking-[0.2em] text-[#9a8677]">EC</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="商品を検索..."
                className="w-full pl-4 pr-10 py-2 bg-[#f3f1ec] border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#d4cbbf] transition-all placeholder-[#9a8677]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/?keyword=${(e.target as HTMLInputElement).value}`)
                  }
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isAuthenticated && !isAdmin && (
              <button
                onClick={toggleCart}
                className="relative p-2.5 text-[#5c4d3f] hover:text-[#1a1410] hover:bg-[#f3f1ec] rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {(cart?.item_count ?? 0) > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#1a1410] text-white text-[10px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-semibold leading-none px-1">
                    {cart!.item_count}
                  </span>
                )}
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-0.5">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#5c4d3f] hover:text-[#1a1410] hover:bg-[#f3f1ec] rounded-full transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">管理</span>
                  </Link>
                )}
                {!isAdmin && (
                  <Link
                    to="/profile"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#5c4d3f] hover:text-[#1a1410] hover:bg-[#f3f1ec] rounded-full transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">{user?.name}</span>
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#5c4d3f] hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">ログアウト</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-[#5c4d3f] hover:text-[#1a1410] font-medium transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm bg-[#1a1410] text-white rounded-full hover:bg-[#3d3229] font-medium transition-colors tracking-wide"
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
