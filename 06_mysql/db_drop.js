// database/migrate.js
import fs from 'fs';
import dotenv from 'dotenv';
import { pool } from './lib/db.js';

dotenv.config();

const database = process.env.DB_DATABASE;

async function truncate() {
    try {
        const sql = `DROP DATABASE IF EXISTS ${database};`;
        console.log("Running drop database...");
        await pool.query(sql);
        console.log("✔ Drop database completed!");
    } catch (err) {
        console.error("❌ Drop database error:", err);
    } finally {
        await pool.end();
    }
}

truncate();