import { getTasks } from "./state"
import { updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from "./api"
import { updateTask, deleteTask } from "./state"

export function render(): void {
  const root = document.getElementById("app")!
  root.innerHTML = ""

  const tasks = getTasks()

  if (tasks.length === 0) {
    const empty = document.createElement("div")
    empty.className = "text-center text-gray-400 py-12 text-sm"
    empty.textContent = "タスクがありません。追加してみましょう！"
    root.appendChild(empty)
    return
  }

  tasks.forEach((task) => {
    const div = document.createElement("div")
    div.className = [
      "flex items-center gap-3 px-1 py-3 border-b border-gray-100 last:border-0",
      "group transition-colors hover:bg-gray-50 rounded-lg",
    ].join(" ")

    // チェックボックス（カスタムスタイル）
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = task.completed
    checkbox.className = "w-5 h-5 rounded-full border-2 border-gray-300 checked:accent-blue-500 cursor-pointer flex-shrink-0"
    checkbox.addEventListener("change", async () => {
      await apiUpdateTask(task.id, checkbox.checked)
      updateTask(task.id, checkbox.checked)
      render()
    })

    // タスク名
    const label = document.createElement("span")
    label.textContent = task.title
    label.className = task.completed
      ? "flex-1 text-sm text-gray-400 line-through"
      : "flex-1 text-sm text-gray-700"

    // 削除ボタン
    const deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `
    deleteBtn.className = [
      "text-gray-300 hover:text-red-400 transition-colors",
      "opacity-0 group-hover:opacity-100 p-1 rounded",
    ].join(" ")
    deleteBtn.addEventListener("click", async () => {
      await apiDeleteTask(task.id)
      deleteTask(task.id)
      render()
    })

    div.appendChild(checkbox)
    div.appendChild(label)
    div.appendChild(deleteBtn)
    root.appendChild(div)
  })

  // フッター：完了数カウンター
  const footer = document.createElement("div")
  const done = tasks.filter((t) => t.completed).length
  footer.className = "text-xs text-gray-400 text-right pb-4 pt-2"
  footer.textContent = `${done} / ${tasks.length} 完了`
  root.appendChild(footer)
}
