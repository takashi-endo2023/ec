import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import apiClient from '../api/client'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/ui/Button'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  if (!isAuthenticated) { navigate('/login'); return null }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors([]); setSuccess(false); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd)
    try {
      await apiClient.patch('/profile', { profile: data })
      setSuccess(true)
    } catch (err: any) {
      setErrors(err.response?.data?.errors ?? ['更新に失敗しました'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">プロフィール</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm mb-4">プロフィールを更新しました</div>}
        {errors.length > 0 && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">{errors.map((e, i) => <p key={i}>{e}</p>)}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">お名前 *</label>
              <input name="name" type="text" required defaultValue={user?.name} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
              <input name="phone" type="tel" defaultValue={user?.phone} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">郵便番号</label>
              <input name="postal_code" type="text" defaultValue={user?.postal_code} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">都道府県</label>
              <input name="prefecture" type="text" defaultValue={user?.prefecture} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">市区町村</label>
              <input name="municipality" type="text" defaultValue={user?.municipality} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">住所</label>
              <input name="address" type="text" defaultValue={user?.address} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
          </div>
          <Button type="submit" loading={loading}>変更を保存</Button>
        </form>
      </div>
    </div>
  )
}
