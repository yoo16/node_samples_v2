// bcrypt インポート
import bcrypt from 'bcrypt';
// DB 接続プール
import { pool } from '../lib/db.js';

// ユーザーデータ雛形
const newUser = {
    id: '',
    name: '',
    email: '',
    password: '',
    avatar_url: '',
};

// 全ユーザーデータ取得
export const initUser = () => {
    return newUser;
};

// 全ユーザーデータ取得
export const fetchAll = async (limit = 50) => {
    const sql = `SELECT * FROM users LIMIT ?;`;
    const [users] = await pool.query(sql, [limit]);
    return users;
};

// IDでユーザー検索
export const findById = async (id) => {
    // DB から取得
    const sql = 'SELECT * FROM users WHERE id = ?';
    // SQL実行: id をバインド
    const [rows] = await pool.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
};

// メールアドレスでユーザー検索
export const findByEmail = async (email) => {
    // email で users テーブルを検索
    const sql = 'SELECT * FROM users WHERE email = ?';
    // SQL 実行: email をバインド
    const [rows] = await pool.query(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
};

// ユーザーデータ保存
export const save = async (newUser) => {
    // パスワードハッシュ化
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    // DB 書き込み処理
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    const [result] = await pool.query(sql, [
        newUser.name,
        newUser.email,
        newUser.password,
    ]);
    // 1 なら成功
    return result.affectedRows
};

// ユーザーデータ保存
export const update = async (id, posts) => {
    console.log("update user: ", posts)
    // DB 書き込み処理
    const sql = "UPDATE users SET ? WHERE id = ?";
    const [result] = await pool.query(sql, [posts, id]);
    return result.affectedRows;
};

// リフレッシュトークンの検証用（ミドルウェアで使用）
export async function findByRefreshToken(id, token) {
    const sql = `SELECT * FROM users WHERE id = ? AND refresh_token = ?`;
    const [rows] = await pool.query(sql, [id, token]);
    return rows[0];
}

// リフレッシュトークン更新
export async function updateRefreshToken(id, token) {
    const sql = `UPDATE users SET refresh_token = ? WHERE id = ?`;
    await pool.query(sql, [token, id]);
}

export default {
    initUser,
    fetchAll,
    findById,
    findByEmail,
    save,
    update,
    findByRefreshToken,
    updateRefreshToken,
};