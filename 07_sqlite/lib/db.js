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
    let i = 0;
    return sql.replace(/\?/g, () => {
        const v = params[i++];
        return typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`;
    });
};

// schema.sql を実行
export const migrate = () => {
    db.exec(fs.readFileSync(path.resolve('database/schema.sql'), 'utf-8'));
};
