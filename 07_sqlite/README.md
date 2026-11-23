# 07_sqlite

Express + SQLite + Tailwind CSS のサンプル。SQLite は Node.js 組み込みの `node:sqlite` を使うので、DB サーバーも追加パッケージも不要です（Node 22.13 以上）。

## Install
```bash
npm i
```

## DB (コマンドラインで確認)
```bash
node db_connect.js        # 接続確認
node db_create.js         # テーブル作成 (database/schema.sql)
node db_import_users.js   # faker でユーザー/フィードを投入
node db_show_tables.js    # テーブル一覧
node db_select_feeds.js   # feeds + users を JOIN して取得
node db_insert_feed.js    # feed を1件追加
node db_update_feed.js    # feed を1件更新
node db_delete_feed.js    # feed を1件削除
node db_transaction.js    # トランザクション (BEGIN / COMMIT / ROLLBACK)
node db_sql_injection.js  # SQL インジェクションのデモ
node db_query.js "SELECT * FROM users LIMIT 3"   # 任意の SQL
node db_truncate.js       # 全データ削除
node db_drop.js           # DB ファイル削除
```

## Run
```bash
npm run dev
```
http://localhost:3000

| Page | Description |
|------|-------------|
| `/` | トップ |
| `/feeds` | タイムライン（投稿・削除・SQL インジェクションデモ） |
| `/users` | ユーザー一覧 |
| `/sql-client` | 定義済みクエリを実行して SQL と結果を表示 |

Tailwind CSS は CDN (`@tailwindcss/browser`) 利用のためビルド不要です。
