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
    return result?.insertId;
};

// IDでユーザー検索
export const find = async (id) => {
    // TODO: DB から取得
    const sql = 'SELECT * FROM users WHERE id = ?';
    console.log("SQL:", sql);
    // SQL 実行: id をバインド変数で渡す
    const [rows] = await pool.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
};

// メールアドレスでユーザー検索
export const findByEmail = async (email) => {
    // TODO: email で users テーブルを検索
    const sql = 'SELECT * FROM users WHERE email = ?';
    console.log("SQL:", sql);
    // SQL 実行: email をバインド変数で渡す
    const [rows] = await pool.query(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
};

// 認証処理
export const auth = async (email, password) => {
    // Email でユーザー検索
    const user = await findByEmail(email);
    console.log("user.auth():", user);
    if (!user) return;

    // パスワードとハッシュを照合
    if (bcrypt.compareSync(password, user.password)) {
        return user;
    }
}

export default {
    initUser,
    fetchAll,
    save,
    find,
    findByEmail,
    auth,
};