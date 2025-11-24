import { pool } from '../lib/db.js';
import * as bcrypt from 'bcrypt';

export const fetchAll = async (limit = 20) => {
    // SQL 文
    const sql = `SELECT * FROM users LIMIT ?;`;
    // SQL 実行
    const [rows] = await pool.query(sql, [limit]);
    // 結果返却
    const result = {
        users: rows,
        sql: pool.format(sql, [limit]),
    };
    return result;
}

export const find = async (id) => {
    // SQL 文
    const sql = `SELECT * FROM users WHERE id = ?;`;
    // SQL 実行
    const [rows] = await pool.query(sql, [id]);
    // 結果返却 JSON
    const result = {
        user: rows[0],
        sql: pool.format(sql, [id]),
    };
    return result;
}

export const count = async () => {
    // SQL 文
    const sql = `SELECT COUNT(id) as count FROM users;`;
    // SQL 実行
    const [rows] = await pool.query(sql);
    // 結果返却
    const result = {
        count: rows[0].count,
        sql: pool.format(sql),
    };
    return result;
}

export const findByEmail = async (email) => {
    try {
        // SQL 文
        const sql = `SELECT * FROM users WHERE email = ?;`;
        // SQL 実行
        const [rows] = await pool.query(sql, [email]);
        console.log(rows);
        // 結果返却 JSON
        const result = {
            users: rows,
            sql: pool.format(sql, [email]),
            errors: [],
        };
        return result;
    } catch (error) {
        const result = {
            errors: [{ msg: error.sqlMessage, }],
            sql: error.sql,
        };
        return result;
    }
}

export const insert = async (posts) => {
    try {
        const { name, email, password } = posts;
        // SQL 文
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        // パスワードハッシュ
        const hashedPassword = await bcrypt.hash(password, 10);
        // SQL 実行
        const params = [name, email, hashedPassword];
        const [rows] = await pool.query(sql, params);
        // 結果返却 JSON
        const result = {
            authUser: rows,
            errors: [],
            sql: pool.format(sql, params),
        };
        return result;
    } catch (error) {
        const result = {
            errors: [{ msg: error.sqlMessage, }],
            sql: error.sql,
        };
        return result;
    }
}

export const update = async (id, posts) => {
    try {
        const { name, email, avatar_url } = posts;
        // SQL 文
        const sql = `UPDATE users 
                SET name = ?, email = ?, avatar_url = ? 
                WHERE id = ?`;
        // SQL 実行
        const params = [name, email, avatar_url, id];
        const [rows] = await pool.query(sql, params);
        const user = rows[0];

        // 結果返却
        const result = {
            user,
            message: "更新しました",
            errors: [],
            sql: pool.format(sql, params),
        };
        return result;
    } catch (error) {
        const result = {
            errors: [{ msg: error.sqlMessage, }],
            sql: error.sql,
        };
        return result;
    }
}

export const auth = async (email, password) => {
    try {
        // SQL 文
        const sql = 'SELECT * FROM users WHERE email = ?';
        // SQL 実行
        const params = [email];
        const [rows] = await pool.query(sql, params);
        // ユーザー存在チェック
        const existUser = rows.length > 0 ? rows[0] : null;
        // パスワード照合
        const isSuccess = await bcrypt.compare(password, existUser.password);
        const errors = isSuccess ? [] : [{ msg: "ログインに失敗しました" }];
        // 結果返却 JSON
        const result = {
            user: isSuccess ? existUser : null,
            sql: pool.format(sql, params),
            errors,
        };
        return result;
    } catch (error) {
        const result = {
            errors: [{ msg: error.sqlMessage, }],
            sql: error.sql,
        };
        return result;
    }
}