import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1a1410] text-[#9a8677] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-serif text-2xl font-bold text-white tracking-tight">MAISON</span>
              <span className="font-serif text-2xl font-light tracking-[0.2em] text-[#c9a96e]">EC</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              厳選された高品質なアイテムで、あなたのライフスタイルをより豊かに。
            </p>
          </div>

          <div>
            <h3 className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-5">ショッピング</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">商品一覧</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">注文履歴</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-5">アカウント</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">ログイン</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">新規登録</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">プロフィール</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-5">サポート</h3>
            <ul className="space-y-3 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">よくある質問</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">お問い合わせ</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">プライバシーポリシー</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#3d3229] pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} MAISON EC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
