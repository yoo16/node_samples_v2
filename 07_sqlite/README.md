# 07_sqlite

Express + SQLite + Tailwind CSS のサンプル。SQLite は Node.js 組み込みの `node:sqlite` を使うので、DB サーバーも追加パッケージも不要です（Node 22.13 以上）。

## Install
```bash
npm i
```

## DB の操作
テーブル作成・削除、テストデータ投入、全データ削除、テーブル一覧は、ブラウザの `/database` ページから実行できます。
接続できているかは、トップページ `/` の `Connected` で確認できます。

任意の SQL をコマンドラインで試すときは、次を使います。
```bash
node db_query.js "SELECT * FROM users LIMIT 3"
```

## Run
```bash
npm run dev
```
http://localhost:3000

| Page | Description |
|------|-------------|
| `/` | トップ |
| `/feeds` | タイムライン（投稿・編集・削除・トランザクション・SQL インジェクションデモ） |
| `/users` | ユーザー一覧 |
| `/sql-client` | 定義済みクエリを実行して SQL と結果を表示 |
| `/database` | テーブル作成・削除、テストデータ投入、全データ削除、テーブル一覧 |

Tailwind CSS は CDN (`@tailwindcss/browser`) 利用のためビルド不要です。
