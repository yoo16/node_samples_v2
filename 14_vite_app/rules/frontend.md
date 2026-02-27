# 🟡 フロントエンドルール

- API呼び出しは api.ts にまとめる
- 状態管理は state.ts にまとめる
- DOM操作は ui.ts にまとめる
- main.ts は初期化のみ

---

## 禁止事項

- main.ts にDOMロジックを書かない
- fetchを直接ui.tsに書かない
