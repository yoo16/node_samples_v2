import { pool } from './lib/db.js';

try {
    // SQL: feeds テーブルから投稿内容とユーザー名、作成日時を取得
    // JOIN を使用して users テーブルと結合
    const sql = `SELECT feeds.content, users.name, feeds.created_at
                FROM feeds
                JOIN users ON feeds.user_id = users.id`

    // SQL 実行
    const [rows] = await pool.query(sql);

    // 結果表示
    console.table(rows);
} catch (error) {
    console.error('Error executing query:', error);
} finally {
    // DB切断
    pool.end();
}