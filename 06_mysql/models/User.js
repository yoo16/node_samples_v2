// bcrypt インポート
import bcrypt from 'bcrypt';
// DB 接続プールインポート
import { pool } from '../lib/db.js';

// 全データ取得
export const fetchAll = async () => {
    try {
        const sql = 'SELECT * FROM users ORDER BY name;';
        const result = await pool.query(sql);
        // ユーザーデータ配列を返す
        const users = result[0];
        return users;
    } catch (error) {
        console.error('Error in fetchAll:', error);
    }
};

// IDで検索
export const find = async (id) => {
    try {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await pool.query(sql, [id]);
        // ユーザーデータ配列を返す
        const user = rows[0];
        return user;
    } catch (error) {
        console.error('Error in find:', error);
    }
};

// データ更新
export const update = async (user) => {
    try {
        const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?;';
        const params = [user.name, user.email, user.id];
        const result = await pool.query(sql, params);
        return result;
    } catch (error) {
        console.error('Error in update:', error);
    }
};

// メールアドレスで検索
export const findByEmail = async (email) => {
    try {
        const sql = 'SELECT * FROM users WHERE email = ?;';
        const params = [email];
        const result = await pool.query(sql, params);
        const users = result[0];
        return users[0];
    } catch (error) {
        console.error('Error in findByEmail:', error);
    }
};

// 認証処理
export const auth = async (email, password) => {
    try {
        const existsUser = await findByEmail(email);
        console.log(email, password);
        console.log('Existing User:', existsUser);
        if (existsUser && bcrypt.compareSync(password, existsUser.password)) {
            return existsUser;
        }
    } catch (error) {
        console.error('Error in auth:', error);
    }
}

export default {
    fetchAll,
    find,
    findByEmail,
    update,
    auth,
};