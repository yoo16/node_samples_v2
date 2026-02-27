import { Task } from "./types"

const host = import.meta.env.VITE_API_HOST ?? "localhost"
const port = import.meta.env.VITE_API_PORT ?? "3000"
const BASE_URL = `http://${host}:${port}`

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tasks`)
  return res.json()
}

export async function createTask(title: string): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  })
  return res.json()
}

export async function updateTask(id: number, completed: boolean): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  })
  return res.json()
}

export async function deleteTask(id: number): Promise<void> {
  await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" })
}
