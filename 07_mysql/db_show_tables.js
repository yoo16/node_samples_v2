// DB接続プール
import { pool } from './lib/db.js';

async function showTables() {
    try {
        const sql = "SHOW TABLES;";
        // SQL 実行
        const [rows] = await pool.query(sql);
        console.log("✔ DB show tables completed!");
        console.table(rows);
    } catch (err) {
        console.error("❌ DB show tables error:", err);
    } finally {
        await pool.end();
    }
}

(async () => {
    await showTables();
})();