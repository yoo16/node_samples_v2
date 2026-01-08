import { pool } from '../lib/db.js';

// 全データ取得
export const fetchAll = async () => {
    // TODO: DB から取得
    // users テーブルと結合: users.name, users.avatarUrl
    const sql = `SELECT 
                feeds.*,
                users.name AS user_name,
                users.avatar_url AS user_avatar_url,
            FROM feeds
            JOIN users ON feeds.user_id = users.id
            GROUP BY feeds.id
            ORDER BY feeds.created_at DESC;`;

    const [feeds] = await pool.query(sql);
    return feeds;
};

// 全データ取得
export const fetchAllWithLikes = async (user, keyword = "", limit = 20) => {
    if (!user) return;

    let data = [user.id];
    // TODO: DB から取得
    // users テーブルと結合: users.name, users.avatarUrl
    // likes テーブルと結合: いいね数をカウント
    let sql = `SELECT 
                    feeds.*,
                    users.name AS user_name,
                    users.avatar_url AS user_avatar_url,
                    COUNT(likes.user_id) AS likes_count,
                    COUNT(mylikes.user_id) AS liked
                FROM feeds
                JOIN users ON feeds.user_id = users.id
                LEFT JOIN likes ON feeds.id = likes.feed_id
                LEFT JOIN likes AS mylikes ON feeds.id = mylikes.feed_id AND mylikes.user_id = ?
                `;
    // TODO: likes で自分の like だったら true
    if (keyword) {
        sql += `WHERE feeds.content LIKE ?`;
        data.push(`%${keyword}%`)
    }
    sql += `GROUP BY feeds.id
            ORDER BY feeds.created_at DESC
            LIMIT ?`;
    data.push(limit);

    const [feeds] = await pool.query(sql, data);
    return feeds;
};

// 全データ取得
export const fetchByUser = async (user, limit = 20) => {
    if (!user) return;

    let data = [user.id, user.id, limit];
    let sql = `SELECT 
                    feeds.*,
                    users.name AS user_name,
                    users.avatar_url AS user_avatar_url,
                    COUNT(likes.user_id) AS likes_count,
                    COUNT(mylikes.user_id) AS liked
                FROM feeds
                JOIN users ON feeds.user_id = users.id
                    LEFT JOIN likes ON feeds.id = likes.feed_id
                    LEFT JOIN likes AS mylikes ON feeds.id = mylikes.feed_id AND mylikes.user_id = ?
                WHERE feeds.user_id = ?
                GROUP BY feeds.id
                ORDER BY feeds.created_at DESC
                LIMIT ?`;

    const [feeds] = await pool.query(sql, data);
    return feeds;
};


// ID でデータ検索
export const findById = async (id) => {
    try {
        const sql = `
            SELECT 
                feeds.*,
                users.name AS user_name,
                users.avatar_url AS user_avatar_url,
                COUNT(likes.user_id) AS likes_count
            FROM feeds
            JOIN users ON feeds.user_id = users.id
            LEFT JOIN likes ON feeds.id = likes.feed_id
            WHERE feeds.id = ?
            GROUP BY feeds.id;
        `;

        const [rows] = await pool.query(sql, [id]);
        return rows[0] || null;

    } catch (error) {
        console.error("Error finding feed by ID:", error);
        throw error;
    }
};

// ユーザーデータ保存
export const add = async (newFeed) => {
    try {
        // TODO: DB 書き込み処理
        const sql = `INSERT INTO feeds (user_id, content) VALUES (?, ?)`;
        // TODO: DB 書き込み処理
        await pool.query(sql, [
            newFeed.user_id,
            newFeed.content,
        ]);
        return true;
    } catch (error) {
        console.error("Error adding feed:", error);
        return false;
    }
};

export default {
    fetchAll,
    fetchAllWithLikes,
    findById,
    add,
    fetchByUser,
};