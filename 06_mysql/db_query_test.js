import { pool } from './lib/db.js';

const sql = 'SELECT id, name FROM users LIMIT 5;';
test(sql);

// テスト用SQL実行関数
export async function test(sql) {
    try {
        const [rows] = await pool.query(sql);
        console.table(rows);
    } catch (e) {
        console.error(e);
    } finally {
        // pool.end() は通常アプリ起動後は使わない！
        await pool.end();
    }
}