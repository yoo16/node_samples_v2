// database/migrate.js
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const user = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD || '';

    if (!host || !port || !user) {
        console.error('.env の MySQL 設定が不足しています。');
        process.exit(1);
    }

    // 初期接続（database 指定なし）
    const pool = await mysql.createPool({
        host,
        port,
        user,
        password,
        multipleStatements: true, // 複数ステートメントを許可
    });

    // schema.sql の読み込み
    const filePath = path.resolve('./schema.sql');
    if (!fs.existsSync(filePath)) {
        console.error('schema.sql ファイルが見つかりません:', filePath);
        process.exit(1);
    }

    try {
        // SQL ファイル読み込み
        const sql = fs.readFileSync(filePath, 'utf-8');
        console.log("Running migration...");

        // SQL 実行
        await pool.query(sql);
        console.log("✔ Migration completed!");
    } catch (err) {
        console.error("❌ Migration error:", err);
    } finally {
        await pool.end();
    }
}

migrate();