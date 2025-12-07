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

// ユーザーデータ保存
export const save = async (newUser) => {
    // TODO: パスワードハッシュ化
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    // TODO: DB 書き込み処理
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    const [result] = await pool.query(sql, [
        newUser.name,
        newUser.email,
        newUser.password,
    ]);
    return result.affectedRows
};

// IDでユーザー検索
export const find = async (id) => {
    // TODO: DB から取得
    const sql = 'SELECT * FROM users WHERE id = ?';
    // SQL実行: id をバインド
    const [rows] = await pool.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
};

// メールアドレスでユーザー検索
export const findByEmail = async (email) => {
    // TODO: email で users テーブルを検索
    const sql = 'SELECT * FROM users WHERE email = ?';
    // SQL 実行: email をバインド
    const [rows] = await pool.query(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
};

export default {
    initUser,
    fetchAll,
    save,
    find,
    findByEmail,
};