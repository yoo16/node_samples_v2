import { db, format } from '../lib/db.js';

export const fetchAll = (limit = 20) => {
    const sql = "SELECT id, name, email, created_at FROM users ORDER BY id LIMIT ?;";
    return { users: db.prepare(sql).all(limit), sql: format(sql, [limit]) };
};

export const count = () => {
    const sql = "SELECT COUNT(*) AS count FROM users;";
    return { count: db.prepare(sql).get().count, sql };
};

export const findByEmail = (email) => {
    const sql = "SELECT id, name, email, created_at FROM users WHERE email = ?;";
    return { users: db.prepare(sql).all(email), sql: format(sql, [email]) };
};
