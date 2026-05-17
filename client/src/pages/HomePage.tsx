import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { getProducts } from '../api/products'
import ProductCard from '../components/product/ProductCard'
import type { Product, PaginationMeta } from '../types'

const CATEGORIES = ['トップス', 'ボトムス', 'アウター', 'シューズ', 'バッグ', 'アクセサリー']

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)

  const keyword = searchParams.get('keyword') ?? ''
  const category = searchParams.get('category') ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  useEffect(() => {
    setLoading(true)
    getProducts({ keyword: keyword || undefined, category: category || undefined, page })
      .then((data) => {
        setProducts(data.products)
        setMeta(data.meta)
      })
      .finally(() => setLoading(false))
  }, [keyword, category, page])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const kw = fd.get('keyword') as string
    setSearchParams(kw ? { keyword: kw } : {})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 mb-10 text-white text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">こだわりの一点を見つけよう</h1>
        <p className="text-indigo-200 mb-6">厳選された高品質アイテムを取り揃えています</p>
        <form onSubmit={handleSearch} className="flex max-w-lg mx-auto gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              name="keyword"
              defaultValue={keyword}
              type="text"
              placeholder="商品名やキーワードで検索..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
          </div>
          <button type="submit" className="bg-white text-indigo-600 font-semibold px-5 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm">
            検索
          </button>
        </form>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <div className="flex items-center gap-1 text-gray-500 text-sm flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          <span>カテゴリ:</span>
        </div>
        <button
          onClick={() => setSearchParams(keyword ? { keyword } : {})}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          すべて
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSearchParams(keyword ? { keyword, category: cat } : { category: cat })}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {keyword && (
        <p className="text-sm text-gray-600 mb-4">
          「{keyword}」の検索結果 ({meta?.total_count ?? 0}件)
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>商品が見つかりませんでした</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setSearchParams({ ...(keyword ? { keyword } : {}), ...(category ? { category } : {}), page: String(p) })}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
