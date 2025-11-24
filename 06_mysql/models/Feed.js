import { pool } from '../lib/db.js';

export const fetchAll = async (limit = 20) => {
    // SQL 文
    const sql = `SELECT * FROM feeds LIMIT ?;`;
    // SQL 実行
    const [users] = await pool.query(sql, [limit]);
    // 結果返却
    const result = {
        users,
        sql: pool.format(sql, [limit]),
    };
    return result;
}

export const find = async (id) => {
    // SQL 文
    const sql = `SELECT * FROM feeds WHERE id = ?;`;
    // SQL 実行
    const [user] = await pool.query(sql, [id]);
    // 結果返却 JSON
    const result = {
        user: user[0],
        sql: pool.format(sql, [id]),
    };
    return result;
}

export const insert = async (posts) => {
    try {
        const { user_id, content } = posts;
        // SQL 文
        const sql = 'INSERT INTO feeds (user_id, content) VALUES (?, ?)';
        // SQL 実行
        const params = [user_id, content];
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