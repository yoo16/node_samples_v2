import { pool } from '../lib/db.js';

export const fetchAll = async (limit = 20) => {
    // TODO: SQL 文
    // 1) feeds と users テーブルを結合
    // 2) feeds と users.user_nameを取得
    // 3) created_at の降順で取得
    const sql = `SELECT feeds.*, users.name AS user_name
                    FROM feeds 
                    JOIN users ON feeds.user_id = users.id
                    ORDER BY feeds.created_at DESC
                    LIMIT ?;`;
    // SQL 実行
    const [feeds] = await pool.query(sql, [limit]);
    // 結果返却
    const data = {
        feeds,
        sql: pool.format(sql, [limit]),
    };
    return data;
}

export const find = async (id) => {
    // SQL 文
    const sql = `SELECT * FROM feeds WHERE id = ?;`;
    // SQL 実行
    const [feeds] = await pool.query(sql, [id]);
    // 結果返却 JSON
    const data = {
        feed: feeds[0],
        sql: pool.format(sql, [id]),
    };
    return data;
}

export const insert = async (posts) => {
    try {
        const { user_id, content } = posts;
        // TODO: SQL 文
        // feeds テーブルに user_id, content を挿入
        const sql = `INSERT INTO feeds (user_id, content) VALUES (?, ?);`;
        // SQL 実行
        const params = [user_id, content];
        const [rows] = await pool.query(sql, params);
        const lastInsertId = rows.insertId;
        // 結果返却 JSON
        const data = {
            id: lastInsertId,
            errors: [],
            sql: pool.format(sql, params),
        };
        return data;
    } catch (error) {
        const data = {
            errors: [{ msg: error.sqlMessage, }],
            sql: error.sql,
        };
        return data;
    }
}

// SQLインジェクション
export const insertInjection = async (posts) => {
    try {
        const { user_id, content } = posts;
        // SQLインジェクション用SQL
        const sql = `INSERT INTO feeds (user_id, content) 
                        VALUES ("${user_id}", "${content}")`;
        const [rows] = await pool.query(sql);
        const lastInsertId = rows.insertId;
        const data = {
            id: lastInsertId,
            errors: [],
            sql,
        };
        return data;
    } catch (error) {
        const data = {
            errors: [{ msg: error.sqlMessage, }],
            sql: error.sql,
        };
        return data;
    }
}

export const destroy = async (id) => {
    try {
        // TODO: SQL 文
        const sql = '';
        const params = [id];
        const result = await pool.query(sql, params);
        const data = {
            id,
            sql: pool.format(sql, params),
            errors: [],
        };
        return data;
    } catch (error) {
        const data = {
            errors: [{ msg: error.sqlMessage, }],
            sql: error.sql,
        };
        return data;
    }
}