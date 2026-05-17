import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { signUp } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'
import Button from '../../components/ui/Button'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    if (fd.get('password') !== fd.get('password_confirmation')) {
      setErrors(['パスワードが一致しません'])
      setLoading(false)
      return
    }
    try {
      const { user, token } = await signUp({
        email: fd.get('email') as string,
        password: fd.get('password') as string,
        password_confirmation: fd.get('password_confirmation') as string,
        name: fd.get('name') as string,
        phone: fd.get('phone') as string,
      })
      setAuth(user, token)
      navigate('/')
    } catch (err: any) {
      setErrors(err.response?.data?.errors ?? ['登録に失敗しました'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-indigo-600 p-3 rounded-2xl">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">新規登録</h1>
          <p className="text-gray-600 mt-1 text-sm">アカウントを作成してください</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">お名前 <span className="text-red-500">*</span></label>
              <input name="name" type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="山田 太郎" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
              <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
              <input name="phone" type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="090-0000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">パスワード <span className="text-red-500">*</span></label>
              <input name="password" type="password" required minLength={8} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="8文字以上" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">パスワード（確認） <span className="text-red-500">*</span></label>
              <input name="password_confirmation" type="password" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="もう一度入力" />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              アカウントを作成
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            すでにアカウントをお持ちの方は{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">ログイン</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
