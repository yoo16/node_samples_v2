import { pool } from './lib/db.js';

async function insertFeedTransaction() {
    let connection;

    try {
        // 1. 💡 コネクションプールから接続を取得
        connection = await pool.getConnection();

        // 2. 💡 コネクションオブジェクトを使ってトランザクション開始
        await connection.beginTransaction();
        console.log('--- トランザクション開始 ---');

        // 3. users テーブルからランダムに1件取得
        const userSQL = `SELECT id FROM users ORDER BY RAND() LIMIT 1`;
        // 💡 connection.query() を使用
        const [userRows] = await connection.query(userSQL);

        if (userRows.length === 0) {
            throw new Error("ユーザーが見つかりませんでした。");
        }
        const userId = userRows[0].id;
        console.log(`ランダムユーザーIDを取得: ${userId}`);

        // 4. feeds テーブルに新しいレコードを追加
        const content = 'こんにちは';
        // 💡 プレースホルダ(?) を使用した安全な SQL
        const feedSQL = `INSERT INTO feeds (user_id, content) 
                                VALUES (?, ?);`;
        // 💡 connection.query() と値の配列を渡す
        const [rows] = await connection.query(feedSQL, [userId, content]);

        console.log('feeds テーブルにレコードを追加しました。');
        console.table(rows);

        // 5. 💡 トランザクションコミット
        await connection.commit();
        console.log('--- トランザクションが正常に完了しました ---');

    } catch (error) {
        console.error('Error executing query:', error);

        if (connection) {
            // 6. 💡 エラー発生時、コネクションオブジェクトを使ってロールバック
            await connection.rollback();
            console.log('--- トランザクションがロールバックされました ---');
        }

    } finally {
        // 7. 💡 最終的にコネクションをプールに解放 (必須)
        if (connection) {
            connection.release();
            console.log('コネクションをプールに解放しました。');
        }

        // ⚠️ pool.end() はアプリケーションの起動と終了のタイミングでのみ使用してください
        // pool.end();
    }
}

insertFeedTransaction();