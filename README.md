# EC サイト（ポートフォリオ）

ファッション系 EC サイトのポートフォリオ作品です。  
Rails API × React (TypeScript) の構成で、ユーザー向けショッピング機能と管理者向け管理機能を実装しています。

---

## 目次

- [技術スタック](#技術スタック)
- [機能一覧](#機能一覧)
- [ER 図 / システム構成](#er-図--システム構成)
- [セットアップ手順](#セットアップ手順)
- [テスト](#テスト)
- [API エンドポイント一覧](#api-エンドポイント一覧)

---

## 技術スタック

### バックエンド

| 技術 | バージョン |
|------|-----------|
| Ruby | 3.3.7 |
| Ruby on Rails | 8.0 |
| MySQL | 8.0 |
| Devise + devise-jwt | JWT 認証 |
| Pundit | 認可 |
| Kaminari | ページネーション |
| rack-cors | CORS 設定 |

### フロントエンド

| 技術 | バージョン |
|------|-----------|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| React Router DOM | 7 |
| TanStack Query | 5 |
| Zustand | 5 |
| Tailwind CSS | 4 |
| React Hook Form + Zod | フォーム・バリデーション |
| Axios | HTTP クライアント |

### インフラ

- Docker / Docker Compose

---

## 機能一覧

### ユーザー向け

- ユーザー登録・ログイン・ログアウト（JWT 認証）
- 商品一覧・商品詳細の閲覧
- カートへの商品追加・数量変更・削除
- 注文確認・注文履歴の閲覧
- 支払い処理（モック実装）
- プロフィールの表示・編集

### 管理者向け

- 管理者ログイン（専用 JWT 認証）
- 商品の登録・編集・削除（CRUD）
- 注文一覧・詳細の確認・ステータス更新
- ユーザー一覧・詳細の確認

---

## ER 図 / システム構成

```
[ブラウザ]
    │ HTTP (JSON)
    ▼
[React フロントエンド] ← Vite 開発サーバー (localhost:5173)
    │ API リクエスト
    ▼
[Rails API サーバー] (localhost:3000)
    │
    ▼
[MySQL 8.0] (localhost:3306)
```

主なモデル関係：

```
User ─── Cart ─── CartItem ─── Product
  └────── Order ── OrderItem ─┘
               └── Payment

Admin（独立した認証エンティティ）
```

---

## セットアップ手順

### 前提条件

- Docker Desktop がインストールされていること

### 1. リポジトリをクローン

```bash
git clone <リポジトリURL>
cd ec
```

### 2. コンテナを起動

```bash
docker compose up
```

初回起動時は自動的に以下が実行されます：

- データベースの作成 (`db:create`)
- マイグレーション (`db:migrate`)
- シードデータの投入 (`db:seed`)

### 3. フロントエンドを起動

別ターミナルで以下を実行してください：

```bash
cd client
npm install
npm run dev
```

### 4. アクセス

| URL | 説明 |
|-----|------|
| http://localhost:5173 | フロントエンド（ユーザー画面） |
| http://localhost:3000 | Rails API サーバー |

### デモ用アカウント

シードデータにより以下のアカウントが自動作成されます：

| ロール | メールアドレス | パスワード |
|--------|---------------|-----------|
| 管理者 | admin@example.com | password123 |

ユーザーアカウントはサインアップ画面から新規作成してください。

### 環境変数（ローカル開発）

`compose.yml` に開発用の値が設定済みです。本番環境では必ず以下の値を変更してください：

| 変数名 | 説明 |
|--------|------|
| `SECRET_KEY_BASE` | Rails の署名・暗号化キー |
| `DATABASE_URL` | データベース接続先 |
| `CORS_ORIGINS` | 許可するフロントエンドのオリジン |

---

## テスト

```bash
# コンテナ内でテストを実行
docker compose exec api bundle exec rspec
```

---

## API エンドポイント一覧

ベース URL: `/api/v1`

### 認証

| メソッド | パス | 説明 |
|---------|------|------|
| POST | `/auth/sign_up` | ユーザー新規登録 |
| POST | `/auth/sign_in` | ユーザーログイン |
| DELETE | `/auth/sign_out` | ユーザーログアウト |
| POST | `/admin/auth/sign_in` | 管理者ログイン |
| DELETE | `/admin/auth/sign_out` | 管理者ログアウト |

### 商品

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| GET | `/products` | 商品一覧 | 不要 |
| GET | `/products/:id` | 商品詳細 | 不要 |
| GET | `/admin/products` | 管理者用商品一覧 | 管理者 |
| POST | `/admin/products` | 商品登録 | 管理者 |
| PATCH | `/admin/products/:id` | 商品更新 | 管理者 |
| DELETE | `/admin/products/:id` | 商品削除 | 管理者 |

### カート・注文・支払い

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| GET | `/cart` | カート取得 | ユーザー |
| POST | `/cart/cart_items` | カートに追加 | ユーザー |
| PATCH | `/cart/cart_items/:id` | 数量変更 | ユーザー |
| DELETE | `/cart/cart_items/:id` | カートから削除 | ユーザー |
| GET | `/orders` | 注文履歴 | ユーザー |
| GET | `/orders/:id` | 注文詳細 | ユーザー |
| POST | `/orders` | 注文作成 | ユーザー |
| POST | `/payments` | 支払い処理（モック） | ユーザー |

### プロフィール

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| GET | `/profile` | プロフィール取得 | ユーザー |
| PATCH | `/profile` | プロフィール更新 | ユーザー |
