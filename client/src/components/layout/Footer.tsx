import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Package className="w-5 h-5 text-indigo-400" />
              EC Shop
            </div>
            <p className="text-sm">高品質な商品をお届けする<br />オンラインショップです。</p>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-3">ショッピング</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">商品一覧</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">注文履歴</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-3">アカウント</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">ログイン</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">新規登録</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">プロフィール</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-3">サポート</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">よくある質問</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">お問い合わせ</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">プライバシーポリシー</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} EC Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
