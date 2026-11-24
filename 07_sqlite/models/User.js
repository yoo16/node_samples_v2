import { db, format } from '../lib/db.js';

export const fetchAll = (limit = 20) => {
    const sql = "SELECT id, name, email, created_at FROM users ORDER BY id LIMIT ?;";
    try {
        const statement = db.prepare(sql);
        const users = statement.all(limit);
        return { users, errors: [], sql: format(sql, [limit]) };
    } catch (error) {
        return { users: [], errors: [{ msg: error.message }], sql: format(sql, [limit]) };
    }
};

export const count = () => {
    const sql = "SELECT COUNT(*) AS count FROM users;";
    try {
        const statement = db.prepare(sql);
        const row = statement.get();
        return { count: row.count, errors: [], sql };
    } catch (error) {
        return { count: 0, errors: [{ msg: error.message }], sql };
    }
};

export const findByEmail = (email) => {
    const sql = "SELECT id, name, email, created_at FROM users WHERE email = ?;";
    try {
        const statement = db.prepare(sql);
        const users = statement.all(email);
        return { users, errors: [], sql: format(sql, [email]) };
    } catch (error) {
        return { users: [], errors: [{ msg: error.message }], sql: format(sql, [email]) };
    }
};
