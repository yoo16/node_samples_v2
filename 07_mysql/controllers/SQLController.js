import mysql from 'mysql2/promise';
import * as userModel from '../models/User.js';
import * as feedModel from '../models/Feed.js';
import dotenv from 'dotenv';
dotenv.config();
import { viewDir } from '../lib/util.js';

// --- データベース接続設定 ---
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// コネクションプールを作成し、アプリケーション全体で維持します
const pool = mysql.createPool(dbConfig);

// SQLクライアントページ
export const index = async (req, res) => {
    const path = viewDir + 'sql_client.html';
    return res.sendFile(path);
}

// users から n件を取得
export const selectUsers = async (req, res) => {
    const limit = req.query.limit || 5;
    const result = await userModel.fetchAll(limit);
    res.json({
        data: result.users,
        message: 'success',
        sql: result.sql
    });
};

// users の件数を取得
export const selectUserCount = async (req, res) => {
    const result = await userModel.count();
    console.log(result);
    const data = [{ count: result.count }];
    res.json({
        data,
        message: 'success',
        sql: result.sql
    });
};

// users から email を使って 1件取得
export const selectUserByEmail = async (req, res) => {
    const email = req.query.email;
    console.log(email);
    const result = await userModel.findByEmail(email);
    res.json({
        data: result.users,
        message: 'success',
        sql: result.sql
    });
};

// feeds に新しいレコードを挿入
export const insertFeeds = async (req, res) => {
    const userId = req.body.userId;
    const content = req.body.content;
    const sql = `INSERT INTO feeds (user_id, content) VALUES (?, ?);`;
    const [result] = await pool.query(sql, [userId, content]);
    // 最新レコードのIDを返却
    const data = { id: result.insertId };
    res.json({
        data,
        message: 'success',
        sql
    });
};

// feeds テーブルの全件を取得: feeds と users をJOINして取得
export const selectFeeds = async (req, res) => {
    const sql = `SELECT users.name AS user_name,
                        feeds.content, 
                        feeds.created_at
                    FROM feeds 
                    JOIN users ON feeds.user_id = users.id
                    ORDER BY feeds.created_at DESC;`;
    const [data] = await pool.query(sql);
    res.json({ data, message: 'success', sql });
};