# アーキテクチャルール

## レイヤー構成

backend/
  index.ts  ← ルーティングのみ
  store.ts  ← DBアクセス
  types.ts  ← 型定義
  db.ts     ← DB初期化

---

## 禁止事項

- index.ts にSQLを書かない
- UIから直接DBを操作しない
- any型を使わない
