import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
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
    <div>
      {/* Hero */}
      <div className="relative w-full bg-[#1a1410] overflow-hidden" style={{ minHeight: 'min(72vh, 620px)' }}>
        {/* Background texture lines */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 79px, #fff 79px, #fff 80px)',
        }} />
        {/* Warm glow */}
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-full bg-[#c9a96e] opacity-[0.07] blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-8 sm:px-16 lg:px-24 flex flex-col justify-center h-full py-24">
          <p className="text-[#c9a96e] text-[10px] tracking-[0.5em] uppercase mb-6 font-light">New Collection 2026</p>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            こだわりの<br />
            <em className="not-italic italic text-[#c9a96e]">一点</em>を<br />
            見つけよう
          </h1>

          <p className="text-white/40 text-sm mb-10 max-w-xs tracking-wide">厳選された高品質アイテムを取り揃えています</p>

          <form onSubmit={handleSearch} className="flex max-w-sm gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a8677] w-4 h-4" />
              <input
                name="keyword"
                defaultValue={keyword}
                type="text"
                placeholder="商品を検索..."
                className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:bg-white/15 focus:border-white/20 transition-all placeholder-white/30"
              />
            </div>
            <button
              type="submit"
              className="bg-[#c9a96e] text-[#1a1410] font-semibold px-5 py-2.5 rounded-full hover:bg-[#d4b87e] transition-colors text-sm tracking-wide"
            >
              検索
            </button>
          </form>

          {/* Decorative bottom rule */}
          <div className="absolute bottom-10 left-8 sm:left-16 lg:left-24 flex items-center gap-4">
            <div className="w-8 h-px bg-[#c9a96e]" />
            <span className="text-[#9a8677] text-[10px] tracking-[0.3em] uppercase">Curated Fashion</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-1">
          <button
            onClick={() => setSearchParams(keyword ? { keyword } : {})}
            className={`flex-shrink-0 px-5 py-2 text-sm tracking-wide transition-all rounded-full ${
              !category
                ? 'bg-[#1a1410] text-white'
                : 'text-[#5c4d3f] hover:text-[#1a1410] border border-[#e8e3da] hover:border-[#d4cbbf]'
            }`}
          >
            すべて
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSearchParams(keyword ? { keyword, category: cat } : { category: cat })}
              className={`flex-shrink-0 px-5 py-2 text-sm tracking-wide transition-all rounded-full ${
                category === cat
                  ? 'bg-[#1a1410] text-white'
                  : 'text-[#5c4d3f] hover:text-[#1a1410] border border-[#e8e3da] hover:border-[#d4cbbf]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results header */}
        {keyword && (
          <div className="flex items-baseline gap-3 mb-8">
            <p className="font-serif text-xl text-[#1a1410]">「{keyword}」</p>
            <p className="text-sm text-[#9a8677]">{meta?.total_count ?? 0}件</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#e8e3da] rounded-xl mb-3" />
                <div className="h-3 bg-[#e8e3da] rounded mb-2" />
                <div className="h-3 bg-[#e8e3da] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-28">
            <p className="font-serif text-2xl text-[#d4cbbf] mb-2">No items found</p>
            <p className="text-sm text-[#9a8677]">商品が見つかりませんでした</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.total_pages > 1 && (
              <div className="flex justify-center gap-2 mt-14">
                {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSearchParams({ ...(keyword ? { keyword } : {}), ...(category ? { category } : {}), page: String(p) })}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-[#1a1410] text-white'
                        : 'text-[#5c4d3f] hover:bg-[#f3f1ec] border border-[#e8e3da]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
