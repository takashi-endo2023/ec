import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { adminSignIn } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'
import Button from '../../components/ui/Button'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { setAdminAuth } = useAuthStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const { token } = await adminSignIn(fd.get('email') as string, fd.get('password') as string)
      setAdminAuth(token)
      navigate('/admin')
    } catch {
      setError('メールアドレスまたはパスワードが正しくありません')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-indigo-600 p-3 rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">管理者ログイン</h1>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          {error && <div className="bg-red-900/50 border border-red-500 text-red-200 rounded-lg p-3 text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">メールアドレス</label>
              <input name="email" type="email" required className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="admin@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">パスワード</label>
              <input name="password" type="password" required className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>ログイン</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
