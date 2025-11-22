import { pool } from '../lib/db.js';

// いいねデータ取得（ユーザー別）
export const fetchByUser = async (user) => {
    // TODO: DB から取得
    // users テーブルと結合: users.name, users.avatarUrl
    const sql = `SELECT * FROM likes WHERE user_id = ?;`
    const [likes] = await pool.query(sql, [user.id]);
    return likes;
};

// いいねデータ取得（フィード別）
export const fetchByFeedId = async (feedId) => {
    // TODO: DB から取得
    const sql = `SELECT * FROM likes WHERE feed_id = ?;`
    const [likes] = await pool.query(sql, [feedId]);
    return likes;
};

// いいねカウント（フィード別）
// DBから like 数を取得
export const countByFeedId = async (feedId) => {
    const sql = `SELECT COUNT(*) AS count_id FROM likes WHERE feed_id = ?`;
    const [rows] = await pool.query(sql, [feedId]);
    return rows[0].count_id;
};

// ID でデータ検索
export const findById = async (feedId, userId) => {
    const sql = `SELECT * FROM likes WHERE feed_id = ? AND user_id = ?;`
    // TODO: DB から取得
    const [like] = await pool.query(sql, [feedId, userId]);
    return like[0] || null;
};

export const update = async (feedId, userId) => {
    try {
        const like = await findById(feedId, userId);
        if (like) {
            // いいね解除（配列から削除）
            const sql = `DELETE FROM likes WHERE feed_id = ? AND user_id = ?;`
            await pool.query(sql, [feedId, userId]);
            return false;
        } else {
            // いいね追加
            const sql = `INSERT INTO likes (feed_id, user_id) VALUES (?, ?);`
            await pool.query(sql, [feedId, userId]);
            return true;
        }
    } catch (error) {
        console.error("Error updating like:", error);
    }
}


export default {
    fetchByFeedId,
    fetchByUser,
    countByFeedId,
    findById,
    update,
};