import { db } from "./db";
import { Task } from "./types";

type TaskRow = {
  id: number;
  title: string;
  completed: number;
};

// 全件取得
export async function getTasks(): Promise<Task[]> {
  const result = await db.execute("SELECT * FROM tasks");
  const rows = result.rows as unknown as TaskRow[];

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
  }));
}

// 追加
export async function addTask(title: string): Promise<Task> {
  const result = await db.execute({
    sql: "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    args: [title, 0],
  });

  return {
    id: Number(result.lastInsertRowid),
    title,
    completed: false,
  };
}

// 更新
export async function updateTask(id: number, completed: boolean): Promise<Task | null> {
  const result = await db.execute({
    sql: "UPDATE tasks SET completed = ? WHERE id = ?",
    args: [completed ? 1 : 0, id],
  });

  if (result.rowsAffected === 0) return null;

  // 更新後のデータを再取得
  const selectResult = await db.execute({
    sql: "SELECT * FROM tasks WHERE id = ?",
    args: [id],
  });

  const row = selectResult.rows[0] as unknown as TaskRow;
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
  };
}

// 削除
export async function deleteTask(id: number): Promise<boolean> {
  const result = await db.execute({
    sql: "DELETE FROM tasks WHERE id = ?",
    args: [id],
  });

  return result.rowsAffected > 0;
}