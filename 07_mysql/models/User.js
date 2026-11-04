import { pool } from '../lib/db.js';
import * as bcrypt from 'bcrypt';

export const fetchAll = async (limit = 20) => {
    // TODO: SQL 文
    // 1) users 取得、
    // 2) 指定した limit で件数制限
    const sql = `SELECT * FROM users LIMIT ?`;
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
    // TODO: SQL 文
    // users テーブルから id 指定で取得
    const sql = `SELECT * FROM users WHERE id = ?`;
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
    // TODO: SQL 文
    // users テーブルの件数を取得
    const sql = ``;
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
        // TODO: SQL 文
        // users テーブルから email 指定で取得
        const sql = `SELECT * FROM users WHERE email = ?`;
        // TODO: パラメータ配列
        const params = [email];
        const result = await pool.query(sql, params);
        const users = result[0];
        return users[0];
    } catch (error) {
        console.error('Error in findByEmail:', error);
    }
}

export const insert = async (posts) => {
    try {
        const { name, email, password } = posts;
        // パスワードハッシュ
        // TODO: SQL 文
        // users テーブルに name, email, password を挿入
        const sql = `INSERT INTO users (name, email, password) 
                        VALUES (?, ?, ?)`;
        // TODO: パラメータ配列
        const params = [name, email, password];
        // SQL 実行
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
        const { name, email } = posts;
        // TODO: SQL 文
        // 1) UPDATE 文で users の name, email を更新
        // 2) users.id で検索
        const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
        // SQL 実行
        const params = [name, email, id];
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
        // ユーザー存在チェック
        const existUser = findByEmail(email);
        // パスワード照合
        if (existUser && bcrypt.compareSync(password, existsUser.password)) {
            return {
                user: existUser,
                sql: "",
                errors,
            };
        } else {
            return {
                user: null,
                sql: "",
                errors: [{ msg: "ログインに失敗しました" }],
            }
        }
    } catch (error) {
        const result = {
            errors: [{ msg: error.sqlMessage, }],
            sql: error.sql,
        };
        return result;
    }
}