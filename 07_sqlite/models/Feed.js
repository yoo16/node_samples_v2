import { db, format } from '../lib/db.js';

export const fetchAll = (limit = 20) => {
    // feeds と users を結合し、新しい順に取得
    const sql = `SELECT feeds.id, feeds.user_id, feeds.content, feeds.created_at,
       users.name AS user_name
FROM feeds
JOIN users ON feeds.user_id = users.id
ORDER BY feeds.created_at DESC, feeds.id DESC
LIMIT ?;`;
    try {
        const statement = db.prepare(sql);
        const feeds = statement.all(limit);
        return { feeds, errors: [], sql: format(sql, [limit]) };
    } catch (error) {
        return { feeds: [], errors: [{ msg: error.message }], sql: format(sql, [limit]) };
    }
};

export const insert = ({ user_id, content }) => {
    const sql = "INSERT INTO feeds (user_id, content) VALUES (?, ?);";
    const params = [Number(user_id), content];
    try {
        const statement = db.prepare(sql);
        const result = statement.run(...params);
        const id = Number(result.lastInsertRowid);
        return { id, errors: [], sql: format(sql, params) };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql: format(sql, params) };
    }
};

export const update = (id, content) => {
    const sql = "UPDATE feeds SET content = ? WHERE id = ?;";
    const params = [content, Number(id)];
    try {
        const statement = db.prepare(sql);
        const result = statement.run(...params);
        const changes = result.changes;
        const errors = changes ? [] : [{ msg: 'Feed not found' }];
        return { id: Number(id), changes, errors, sql: format(sql, params) };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql: format(sql, params) };
    }
};

// トランザクション: 2件まとめて追加 (fail: true なら2件目の前に失敗 → ROLLBACK)
export const insertTwice = ({ user_id, fail = false }) => {
    const sql = "INSERT INTO feeds (user_id, content) VALUES (?, ?);";
    const sql1 = format(sql, [Number(user_id), 'トランザクション1']);
    const sql2 = format(sql, [Number(user_id), 'トランザクション2']);
    let began = false;
    try {
        const statement = db.prepare(sql);
        db.exec('BEGIN');
        began = true;
        statement.run(Number(user_id), 'トランザクション1');
        if (fail) throw new Error('わざと失敗させました (1件目も取り消されます)');
        statement.run(Number(user_id), 'トランザクション2');
        db.exec('COMMIT');
        return { errors: [], sql: `BEGIN;\n${sql1}\n${sql2}\nCOMMIT;` };
    } catch (error) {
        if (began) db.exec('ROLLBACK');
        return { errors: [{ msg: error.message }], sql: `BEGIN;\n${sql1}\n-- エラー\nROLLBACK;` };
    }
};

// ⚠️ SQL インジェクションのデモ用 (文字列連結 + 複数文の実行)
export const insertInjection = ({ user_id, content }) => {
    const sql = `INSERT INTO feeds (user_id, content) VALUES (${user_id}, '${content}');`;
    try {
        db.exec(sql); // exec() は複数のSQL文を実行できてしまう
        return { errors: [], sql };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql };
    }
};

export const destroy = (id) => {
    const sql = "DELETE FROM feeds WHERE id = ?;";
    try {
        const statement = db.prepare(sql);
        const result = statement.run(Number(id));
        const changes = result.changes;
        return { id, changes, errors: [], sql: format(sql, [Number(id)]) };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql };
    }
};
