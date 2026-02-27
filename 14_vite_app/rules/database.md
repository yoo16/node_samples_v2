# 🗄 データベースルール

使用DB: SQLite

テーブル:

tasks

- id INTEGER PRIMARY KEY AUTOINCREMENT
- title TEXT NOT NULL
- completed INTEGER NOT NULL DEFAULT 0

---

## 方針

- completed は INTEGER で保存
- アプリ側では boolean に変換
- テーブル作成は db.ts で実行
