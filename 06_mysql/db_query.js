import { pool } from './lib/db.js';

// uses から 5件を取得
const selectUsers = async (limit = 50) => {
    let sql = `SELECT id, name FROM users LIMIT ?;`;
    const params = [limit];
    const [rows] = await pool.query(sql, params);
    console.table(rows)
};

// uses から 5件を取得
const selectUserCount = async () => {
    let sql = `SELECT COUNT(id) AS count FROM users;`;
    const [rows] = await pool.query(sql);
    console.log(rows[0].count)
};


// users から email を使って 1件取得
const selectUserByEmail = async (email) => {
    const sql = `SELECT id, name FROM users WHERE email = ?;`;
    const [rows] = await pool.query(sql, [email]);
    console.table(rows)
};

// users.name に キーワードを含むレコードを取得
const selectUserByName = async (keyword) => {
    const sql = `SELECT name, email FROM users WHERE name LIKE ?;`;
    // LIKE 検索用の % を追加
    keyword = `%${keyword}%`
    const [rows] = await pool.query(sql, [keyword]);
    console.table(rows)
};

// users.name に キーワードを含むレコードを取得
const insertFeeds = async (userId, content) => {
    const sql = `INSERT INTO feeds (user_id, content) VALUES (?, ?);`;
    const [rows] = await pool.query(sql, [userId, content]);
    console.table(rows)
};

const selectFeeds = async () => {
    const sql = `SELECT user_id, content, created_at FROM feeds;`;
    const [rows] = await pool.query(sql);
    console.table(rows)
};

const searchFeeds = async () => {
    const sql = `SELECT users.name,
                        feeds.content, 
                        feeds.created_at
                    FROM feeds 
                    JOIN users ON feeds.user_id = users.id;`;
    const [rows] = await pool.query(sql);
    console.table(rows)
};

// await selectUsers(10);
// await selectUserCount();
// await selectUserByEmail("user1@test.com");
// await selectUserByName("Go");
// await insertFeeds("4f9c19a0-c840-11f0-b270-2713ed6b4f4d", "こんにちは！");
// await selectFeeds();
// await selectFeedsByUserId();

// pool 終了
pool.end();