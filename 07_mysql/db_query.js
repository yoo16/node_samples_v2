import { pool } from './lib/db.js';

// SQL 文
const sql = `SELECT name, email FROM users LIMIT 5;`;
// SQL 実行
const [rows] = await pool.query(sql);
// 表示
console.table(rows);

pool.end();