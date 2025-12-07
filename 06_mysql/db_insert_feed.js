import { pool } from './lib/db.js';

try {
    // TODO: users テーブルからランダムに1件取得
    const userSQL = `SELECT id FROM users ORDER BY RAND() LIMIT 1`;
    const [userRows] = await pool.query(userSQL);
    const userId = userRows[0].id;

    // TODO: feeds テーブルに新しいレコードを追加
    const content = 'こんにちは';
    const feedSQL = `INSERT INTO feeds (user_id, content) 
                            VALUES ('${userId}', '${content}');`;
    const [rows] = await pool.query(feedSQL);

    console.table(rows);
} catch (error) {
    console.error('Error executing query:', error);
} finally {
    // DB切断
    pool.end();
}