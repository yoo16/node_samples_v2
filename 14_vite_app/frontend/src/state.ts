import { Task } from "./types"

let tasks: Task[] = []

export function setTasks(newTasks: Task[]): void {
  tasks = newTasks
}

export function getTasks(): Task[] {
  return tasks
}

export function addTask(task: Task): void {
  tasks.push(task)
}

export function updateTask(id: number, completed: boolean): void {
  const task = tasks.find((t) => t.id === id)
  if (task) task.completed = completed
}

export function deleteTask(id: number): void {
  tasks = tasks.filter((t) => t.id !== id)
}
