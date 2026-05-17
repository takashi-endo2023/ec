import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Package } from 'lucide-react'
import apiClient from '../../api/client'
import { adminCreateProduct, adminUpdateProduct } from '../../api/products'
import { useAuthStore } from '../../stores/authStore'
import type { Product } from '../../types'
import Button from '../../components/ui/Button'

export default function AdminProductFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { isAdmin } = useAuthStore()
  const isEdit = !!id

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdmin) { navigate('/admin/login'); return }
    if (isEdit) {
      setLoading(true)
      apiClient.get<{ product: Product }>(`/admin/products/${id}`)
        .then((res) => {
          setProduct(res.data.product)
          if (res.data.product.image_url) setImagePreview(res.data.product.image_url)
        })
        .finally(() => setLoading(false))
    }
  }, [isAdmin, id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors([]); setSaving(true)
    const fd = new FormData(e.currentTarget)
    try {
      if (isEdit) {
        await adminUpdateProduct(Number(id), fd)
      } else {
        await adminCreateProduct(fd)
      }
      navigate('/admin')
    } catch (err: any) {
      setErrors(err.response?.data?.errors ?? ['保存に失敗しました'])
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate('/admin')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? '商品編集' : '新規商品追加'}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-6">
            {errors.map((e, i) => <p key={i}>{e}</p>)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品名 *</label>
            <input
              name="name"
              type="text"
              required
              defaultValue={product?.name}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="例: プレミアムコットンTシャツ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="商品の詳細説明を入力してください"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">価格 (円) *</label>
              <input
                name="price"
                type="number"
                required
                min="0"
                defaultValue={product?.price}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="3980"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">在庫数 *</label>
              <input
                name="stock"
                type="number"
                required
                min="0"
                defaultValue={product?.stock}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
            <select
              name="category"
              defaultValue={product?.category ?? ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">カテゴリを選択</option>
              {['トップス', 'ボトムス', 'アウター', 'シューズ', 'バッグ', 'アクセサリー', 'その他'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">商品画像</label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="プレビュー" className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (最大10MB)</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              キャンセル
            </Button>
            <Button type="submit" loading={saving}>
              {isEdit ? '変更を保存' : '商品を追加'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
