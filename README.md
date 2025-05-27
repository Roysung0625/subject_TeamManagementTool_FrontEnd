実行(rootで) : npm run serve

# Team Task Manager - 簡易SaaS型タスク共有ツール

## 📋 プロジェクト概要

Vue.js 3を使用して開発された簡易なタスク共有SaaSツールのフロントエンド部分です。チーム単位でのタスク管理、進捗追跡、メンバー管理機能を提供します。

## 🎯 主要機能

### ✅ 実装済み機能
- **ユーザー認証**
  - 会員登録（サインアップ）
  - ログイン・ログアウト
  - JWT認証による状態管理

- **ダッシュボード**
  - チーム一覧表示・管理
  - タスク進捗ボード
  - タスクリスト表示
  - 統計情報パネル

- **チーム管理**
  - チーム作成・編集・削除
  - チームメンバー管理
  - ワークスペース詳細モーダル

- **タスク管理**
  - タスク作成・編集・削除
  - ステータス管理（待機・進行中・完了・キャンセル）
  - 担当者割り当て
  - カテゴリ分類
  - 期限設定

- **フィルタリング機能**
  - 担当者別フィルター
  - ステータス別フィルター
  - カテゴリ検索
  - ページネーション

- **チーム詳細画面**
  - チーム別タスク一覧
  - 詳細フィルタリング
  - タスク詳細モーダル

## 🛠 技術スタック

### フロントエンド
- **Vue.js 3** - メインフレームワーク
- **Vue Router 4** - ルーティング管理
- **Pinia** - 状態管理
- **Pug** - テンプレートエンジン（Vueコンポーネント内で使用）
- **JavaScript (ES6+)** - プログラミング言語

### 開発ツール
- **Vue CLI 5** - プロジェクト管理
- **ESLint** - コード品質管理
- **Babel** - JavaScript トランスパイラ

### 主要ライブラリ
```json
{
  "vue": "^3.2.13",
  "vue-router": "^4.5.1",
  "pinia": "^3.0.2",
  "pug": "^3.0.3"
}
```

## 📁 プロジェクト構造

```
team_management_tool/
├── src/
│   ├── components/           # Vueコンポーネント
│   │   ├── auth/            # 認証関連コンポーネント
│   │   ├── common/          # 共通コンポーネント
│   │   ├── dashBoard/       # ダッシュボード関連
│   │   └── TeamTasksDetail/ # チーム詳細関連
│   ├── views/               # ページコンポーネント
│   ├── stores/              # Pinia状態管理
│   ├── services/            # API通信サービス
│   ├── utils/               # ユーティリティ
│   ├── config/              # 設定ファイル
│   └── router/              # ルーティング設定
├── public/                  # 静的ファイル
└── docs/                    # 設計書（予定）
```

## 🚀 セットアップ・実行方法

### 前提条件
- Node.js (v14以上推奨)
- npm または yarn

### インストール
```bash
# リポジトリをクローン
git clone [repository-url]
cd team_management_tool

# 依存関係をインストール
npm install
```

### 開発サーバー起動
```bash
# 開発サーバーを起動（ホットリロード有効）
npm run serve

# ブラウザで http://localhost:8080 にアクセス
```

### ビルド
```bash
# 本番用ビルド
npm run build

# コードリント
npm run lint
```

## 🎨 主要画面

### 1. 認証画面
- **ログイン画面** (`/login`)
  - 社員番号・パスワード入力
  - 会員登録へのリンク

- **会員登録画面** (`/register`)
  - 名前・パスワード・パスワード確認入力
  - バリデーション機能

### 2. ダッシュボード (`/dashboard`)
- **グリッドレイアウト**
  - ユーザー情報タグ
  - チームリスト（左側）
  - 進捗ボード（中央）
  - タスクリスト（右側）
  - タスク作成フォーム（下部左）
  - 統計パネル（下部右）

### 3. チーム詳細画面 (`/teamtasks`)
- チーム別タスク一覧
- 高度なフィルタリング機能
- ページネーション
- タスク詳細編集モーダル

## 🔧 主要コンポーネント

### 状態管理 (Pinia Stores)
- **authStore** - 認証状態管理
- **teamStore** - チーム情報管理
- **taskStore** - タスク情報管理
- **userStore** - ユーザー情報管理

### サービス層
- **authService** - 認証API通信
- **teamService** - チームAPI通信
- **taskService** - タスクAPI通信

### 共通コンポーネント
- **BaseButton** - 汎用ボタンコンポーネント
- **FormInput** - フォーム入力コンポーネント
- **ErrorMessage** - エラー表示コンポーネント

## 🌐 API連携

### 認証エンドポイント
- `POST /api/auth/login` - ログイン
- `POST /api/auth/register` - 会員登録
- `POST /api/auth/logout` - ログアウト

### チーム管理エンドポイント
- `GET /api/teams` - チーム一覧取得
- `POST /api/teams` - チーム作成
- `PATCH /api/teams/:id` - チーム更新
- `DELETE /api/teams/:id` - チーム削除
- `GET /api/teams/:id/members` - チームメンバー取得

### タスク管理エンドポイント
- `GET /api/tasks` - タスク一覧取得
- `POST /api/tasks` - タスク作成
- `PATCH /api/tasks/:id` - タスク更新
- `DELETE /api/tasks/:id` - タスク削除

## 🎯 特徴的な実装

### 1. Pugテンプレートの活用
```pug
template(lang="pug")
  .dashboard-grid
    UserTag(
      :userName="loginUserName"
      :userRole="loginUserRole"
    )
    TeamList(
      @team-selected="handleTeamSelected"
    )
```

### 2. Composition API + Pinia
```javascript
import { useAuthStore } from '@/stores/auth'
import { useTeamStore } from '@/stores/team'

const authStore = useAuthStore()
const teamStore = useTeamStore()
```

## 🔄 状態管理フロー

1. **認証フロー**
   - ログイン → JWT取得 → authStore更新 → ダッシュボード遷移

2. **チーム選択フロー**
   - チーム選択 → teamStore更新 → 関連コンポーネント更新

3. **タスク管理フロー**
   - タスク操作 → API通信 → ローカル状態更新 → UI反映

## 📝 今後の拡張予定

- [ ] バックエンドAPI（Ruby on Rails）との連携
- [ ] リアルタイム通知機能
- [ ] ファイル添付機能
- [ ] 詳細な権限管理
- [ ] モバイル対応
- [ ] ダークモード対応

## 🧪 テスト

現在はフロントエンド部分のみの実装のため、バックエンド連携後にE2Eテストを追加予定です。

## 📄 ライセンス

このプロジェクトは学習・評価目的で作成されています。

## 👥 開発者

データⅩ エンジニア選考課題として開発

---

**注意**: このプロジェクトは現在フロントエンド部分のみの実装です。完全な動作にはRuby on Rails APIバックエンドとの連携が必要です。
