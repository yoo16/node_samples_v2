# 使用技術一覧

## フロントエンド

- Vite
- TypeScript
- Fetch API
- TailwindCSS（CDN）

## バックエンド

- Hono
- Node.js

## データベース

- SQLite
- libsql/client

## アーキテクチャ方針

- 型定義は分離
- APIとUIは分離
- DBロジックはstore層にまとめる
- index.ts はルーティングのみ担当
