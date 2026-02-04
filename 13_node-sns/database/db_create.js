// DB接続プール(DB指定なし)
import { poolRoot } from '../src/lib/db.js';
import fs from 'fs';

async function createDatabase(filePath) {
    // schema.sql の読み込み
    if (!fs.existsSync(filePath)) {
        console.error('schema.sql ファイルが見つかりません:', filePath);
        process.exit(1);
    }

    try {
        // SQL ファイル読み込み
        const sql = fs.readFileSync(filePath, 'utf-8');
        console.log("Running migration...");

        // SQL 実行
        await poolRoot.query(sql);
        console.log("✔ DB create completed!");
    } catch (err) {
        console.error("❌ DB create error:", err);
    } finally {
        await poolRoot.end();
    }
}

(async () => {
    await createDatabase('./database/schema.sql');
})();