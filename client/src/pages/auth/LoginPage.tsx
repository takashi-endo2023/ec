import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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

  const inputCls = 'w-full bg-[#faf9f7] border border-[#e8e3da] rounded-lg px-4 py-3 text-sm text-[#1a1410] focus:outline-none focus:border-[#9a8677] focus:ring-1 focus:ring-[#9a8677]/30 transition-all placeholder-[#b8a99a]'

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1410] items-center justify-center p-16">
        <div className="text-center">
          <div className="flex items-baseline gap-1 justify-center mb-6">
            <span className="font-serif text-4xl font-bold text-white tracking-tight">MAISON</span>
            <span className="font-serif text-4xl font-light tracking-[0.2em] text-[#c9a96e]">EC</span>
          </div>
          <p className="text-[#9a8677] text-sm leading-relaxed max-w-xs">
            厳選された高品質なアイテムで、<br />あなたのライフスタイルをより豊かに。
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#faf9f7]">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="font-serif text-3xl font-bold text-[#1a1410] mb-2">ログイン</h1>
            <p className="text-sm text-[#9a8677]">アカウントにサインインしてください</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#5c4d3f] tracking-wide mb-1.5">メールアドレス</label>
              <input name="email" type="email" required className={inputCls} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5c4d3f] tracking-wide mb-1.5">パスワード</label>
              <input name="password" type="password" required className={inputCls} placeholder="••••••••" />
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full !bg-[#1a1410] !text-white hover:!bg-[#3d3229] !rounded-full !py-3 !text-sm tracking-wide"
                size="lg"
                loading={loading}
              >
                ログイン
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-[#9a8677] mt-8">
            アカウントをお持ちでない方は{' '}
            <Link to="/register" className="text-[#1a1410] font-medium hover:underline underline-offset-2">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
