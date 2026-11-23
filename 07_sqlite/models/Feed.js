import { db, format } from '../lib/db.js';

export const fetchAll = (limit = 20) => {
    // feeds と users を結合し、新しい順に取得
    const sql = `SELECT feeds.id, feeds.user_id, feeds.content, feeds.created_at,
       users.name AS user_name
FROM feeds
JOIN users ON feeds.user_id = users.id
ORDER BY feeds.created_at DESC, feeds.id DESC
LIMIT ?;`;
    return { feeds: db.prepare(sql).all(limit), sql: format(sql, [limit]) };
};

export const insert = ({ user_id, content }) => {
    const sql = "INSERT INTO feeds (user_id, content) VALUES (?, ?);";
    const params = [Number(user_id), content];
    try {
        const { lastInsertRowid } = db.prepare(sql).run(...params);
        return { id: Number(lastInsertRowid), errors: [], sql: format(sql, params) };
    } catch (e) {
        return { errors: [{ msg: e.message }], sql: format(sql, params) };
    }
};

// ⚠️ SQL インジェクションのデモ用 (文字列連結 + 複数文の実行)
export const insertInjection = ({ user_id, content }) => {
    const sql = `INSERT INTO feeds (user_id, content) VALUES (${user_id}, '${content}');`;
    try {
        db.exec(sql); // exec() は複数のSQL文を実行できてしまう
        return { errors: [], sql };
    } catch (e) {
        return { errors: [{ msg: e.message }], sql };
    }
};

export const destroy = (id) => {
    const sql = "DELETE FROM feeds WHERE id = ?;";
    try {
        const { changes } = db.prepare(sql).run(Number(id));
        return { id, changes, errors: [], sql: format(sql, [Number(id)]) };
    } catch (e) {
        return { errors: [{ msg: e.message }], sql };
    }
};
