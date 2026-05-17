import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CartDrawer from './components/cart/CartDrawer'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductFormPage from './pages/admin/AdminProductFormPage'

const queryClient = new QueryClient()
const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

function DemoBanner() {
  if (!DEMO) return null
  return (
    <div className="sticky top-0 z-[60] bg-[#1a1410] text-[#c9a96e] text-center text-xs py-2 px-4 tracking-wide">
      🎭 デモモード — データはモックです。どのメールアドレス・パスワードでもログインできます。
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DemoBanner />
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Admin routes (no header/footer) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/*" element={
              <>
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/products/new" element={<AdminProductFormPage />} />
                    <Route path="/products/:id/edit" element={<AdminProductFormPage />} />
                  </Routes>
                </main>
              </>
            } />

            {/* Auth routes (no footer) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Main routes */}
            <Route path="*" element={
              <>
                <Header />
                <CartDrawer />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
