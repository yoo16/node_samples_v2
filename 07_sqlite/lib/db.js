import { DatabaseSync } from 'node:sqlite';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config({ quiet: true });

// DB ファイルのパス (.env の DB_FILE)
export const dbFile = path.resolve(process.env.DB_FILE || 'database/app.db');
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

// 接続 (ファイルがなければ自動作成)
export const db = new DatabaseSync(dbFile);
// 外部キー制約を有効化 (SQLite は接続ごとに指定が必要)
db.exec('PRAGMA foreign_keys = ON;');

// 画面表示用: ? をパラメータで置換した SQL 文字列
export const format = (sql, params = []) => {
    let index = 0;
    return sql.replace(/\?/g, () => {
        const value = params[index++];
        return typeof value === 'number' ? String(value) : `'${String(value).replace(/'/g, "''")}'`;
    });
};

// schema.sql を実行
export const migrate = () => {
    const schemaFile = path.resolve('database/schema.sql');
    const schema = fs.readFileSync(schemaFile, 'utf-8');
    db.exec(schema);
};
