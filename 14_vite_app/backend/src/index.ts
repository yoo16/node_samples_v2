import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { cors } from "hono/cors"
import { getTasks, addTask, updateTask, deleteTask } from "./store"

const app = new Hono()

app.use("*", cors())

// async を追加し、await getTasks() に変更
app.get("/tasks", async (c) => {
  const tasks = await getTasks()
  return c.json(tasks)
})

app.post("/tasks", async (c) => {
  const body = await c.req.json<{ title: string }>()
  // await を追加
  const task = await addTask(body.title)
  console.log(task)
  return c.json(task)
})

app.put("/tasks/:id", async (c) => {
  const id = Number(c.req.param("id"))
  const body = await c.req.json<{ completed: boolean }>()
  // await を追加
  const task = await updateTask(id, body.completed)
  if (!task) return c.json({ error: "Not found" }, 404)
  return c.json(task)
})

// async を追加し、await を使用
app.delete("/tasks/:id", async (c) => {
  const id = Number(c.req.param("id"))
  const ok = await deleteTask(id)
  if (!ok) return c.json({ error: "Not found" }, 404)
  return c.json({ success: true })
})

const port = Number(process.env.PORT ?? 3000)
const host = process.env.HOST ?? "localhost"

serve({ fetch: app.fetch, port, hostname: host }, (info) => {
  console.log(`Server running at http://${host}:${info.port}`)
})