// database/migrate.js
import { pool } from './lib/db.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function insert(filePath) {
    // .sql の読み込み
    if (!fs.existsSync(filePath)) {
        console.error('schema.sql ファイルが見つかりません:', filePath);
        process.exit(1);
    }

    try {
        // insert SQL ファイル読み込み
        const sql = fs.readFileSync(filePath, 'utf-8');
        console.log("Running migration...");

        // SQL 実行
        await pool.query(sql);
        console.log("✔ Migration completed!");
    } catch (err) {
        console.error("❌ Import error:");
    } finally {
        await pool.end();
    }
}

(async () => {
    await insert('./database/insert_users.sql');
})();