# 🔵 TypeScriptルール

- any型は禁止
- 型は types.ts に定義する
- APIレスポンス型を必ず明示する
- nullチェックを行う

---

## 例

export type Task = {
  id: number
  title: string
  completed: boolean
}
