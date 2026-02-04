// DB接続プール
import { pool } from '../src/lib/db.js';
import fs from 'fs';

async function truncate(filePath) {
    // truncate.sql の読み込み
    if (!fs.existsSync(filePath)) {
        console.error('truncate.sql ファイルが見つかりません:', filePath);
        process.exit(1);
    }

    try {
        // SQL ファイル読み込み
        const sql = fs.readFileSync(filePath, 'utf-8');
        console.log("Running truncate...");

        // SQL 実行
        await pool.query(sql);
        console.log("✔ DB truncate completed!");
    } catch (err) {
        console.error("❌ DB truncate error:", err);
    } finally {
        await pool.end();
    }
}

(async () => {
    await truncate('./database/truncate.sql');
})();