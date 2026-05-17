import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Package } from 'lucide-react'
import { signIn } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'
import Button from '../../components/ui/Button'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: string })?.from ?? '/'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const { user, token } = await signIn(fd.get('email') as string, fd.get('password') as string)
      setAuth(user, token)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(
        err.response?.data?.error ??
        err.response?.data?.errors?.[0] ??
        'メールアドレスまたはパスワードが正しくありません'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-indigo-600 p-3 rounded-2xl">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ログイン</h1>
          <p className="text-gray-600 mt-1 text-sm">アカウントにサインインしてください</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
              <input
                name="email"
                type="email"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
              <input
                name="password"
                type="password"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              ログイン
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            アカウントをお持ちでない方は{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
