import { fetchTasks, createTask } from "./api"
import { setTasks, addTask } from "./state"
import { render } from "./ui"

async function init(): Promise<void> {
  const tasks = await fetchTasks()
  setTasks(tasks)
  render()
}

const form = document.querySelector("form")!
const input = document.querySelector("input") as HTMLInputElement

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  if (!input.value.trim()) return
  const newTask = await createTask(input.value.trim())
  addTask(newTask)
  render()
  input.value = ""
})

init()
