import { createClient } from "@libsql/client";
import { readFile } from "node:fs/promises";
import { join } from "node:path";


const dbName = process.env.DB_NAME ?? "tasks.db";
const schemaSQL = "database/schema.sql";

// createClient を使用（URL形式で指定）
export const db = createClient({
  url: `file:${dbName}`,
});

// テーブル作成（非同期実行）
const initDB = async () => {
  try {
    const schemaPath = join(process.cwd(), schemaSQL);
    const schema = await readFile(schemaPath, "utf-8");
    await db.execute(schema);
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};


initDB().catch(console.error);