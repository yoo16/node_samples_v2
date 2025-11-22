// database/migrate.js
import fs from 'fs';
import dotenv from 'dotenv';
import { pool } from './lib/db.js';

dotenv.config();

const filePath = './database/truncate.sql';

async function truncate() {
    // .sql の読み込み
    if (!fs.existsSync(filePath)) {
        console.error('truncate.sql ファイルが見つかりません:', filePath);
        process.exit(1);
    }

    try {
        let sql = fs.readFileSync(filePath, 'utf-8');
        console.log("Running truncate...");
        await pool.query(sql);
        console.log("✔ Truncate completed!");
    } catch (err) {
        console.error("❌ Truncate error:", err);
    } finally {
        await pool.end();
    }
}

truncate();