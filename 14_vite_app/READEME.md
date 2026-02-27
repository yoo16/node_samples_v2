# タスク管理アプリ

Vite + Hono + SQLite で構築した学習用のタスク管理アプリです。

---

## 技術スタック

| 役割 | 技術 |
|------|------|
| フロントエンド | Vite + TypeScript |
| バックエンド | Hono + Node.js |
| データベース | SQLite（libsql） |
| スタイル | TailwindCSS（CDN） |

---

## インストール

```bash
# ルートの依存関係（concurrently）
npm install
# バックエンドの依存関係
npm install --prefix backend
# フロントエンドの依存関係
npm install --prefix frontend
```

## ディレクトリ構成

```bash
vite_app/
├── package.json          ← 同時起動（concurrently）
├── READEME.md
├── CLAUDE.md
├── SKILL.md
├── rules/
├── frontend/
│   ├── .env              ← API接続先設定
│   ├── .env.sample       ← 環境変数テンプレート
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts       ← 初期化
│       ├── types.ts      ← 型定義
│       ├── api.ts        ← APIリクエスト
│       ├── state.ts      ← 状態管理
│       └── ui.ts         ← DOM操作
└── backend/
    ├── .env              ← サーバー・DB設定
    ├── .env.sample       ← 環境変数テンプレート
    ├── tasks.db          ← SQLiteデータベース（自動生成）
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts      ← ルーティング
        ├── types.ts      ← 型定義
        ├── db.ts         ← DB初期化
        └── store.ts      ← CRUDロジック
```

---

## セットアップ

### 1. 環境変数の準備

```bash
cp backend/.env.sample backend/.env
cp frontend/.env.sample frontend/.env
```

必要に応じて各 `.env` を編集してください。

**backend/.env**

```bash
PORT=3000
HOST=localhost
DB_NAME=tasks.db
```

**frontend/.env**

```bash
VITE_API_HOST=localhost
VITE_API_PORT=3000
```

### 2. 依存関係のインストール

```bash
# ルート（concurrently）
npm install

# バックエンド
npm install --prefix backend

# フロントエンド
npm install --prefix frontend
```

---

## 起動

```bash
npm run dev
```

| サービス | URL |
|----------|-----|
| フロントエンド | <http://localhost:5173> |
| バックエンド API | <http://localhost:3000> |

---

## API エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/tasks` | タスク一覧取得 |
| POST | `/tasks` | タスク作成 |
| PUT | `/tasks/:id` | 完了状態の更新 |
| DELETE | `/tasks/:id` | タスク削除 |

### 動作確認例

```bash
# 一覧取得
curl http://localhost:3000/tasks

# 作成
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "新しいタスク"}'

# 完了に更新
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 削除
curl -X DELETE http://localhost:3000/tasks/1
```

---

## 注意事項

- `.env` はバージョン管理に含めないでください（`.gitignore` に追加推奨）
- `tasks.db` はバックエンド起動時に自動生成されます
