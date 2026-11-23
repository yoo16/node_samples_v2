import * as User from '../models/User.js';
import * as Feed from '../models/Feed.js';

export const userList = (req, res) => {
    const r = User.fetchAll(Number(req.query.limit) || 20);
    res.json({ users: r.users, sql: r.sql, message: 'Listed', errors: [] });
};

export const feedList = (req, res) => {
    const r = Feed.fetchAll(Number(req.query.limit) || 20);
    res.json({ feeds: r.feeds, sql: r.sql, message: 'Listed', errors: [] });
};

export const feedPost = (req, res) => {
    const r = Feed.insert(req.body);
    res.status(r.errors.length ? 400 : 200).json({ ...r, message: 'Posted' });
};

export const feedPostInjection = (req, res) => {
    const r = Feed.insertInjection(req.body);
    res.json({ ...r, message: 'Posted (injection)' });
};

export const feedDestroy = (req, res) => {
    const r = Feed.destroy(req.params.id);
    res.json({ ...r, message: 'Deleted' });
};

// SQL クライアント用: 定義済みクエリ
export const usersCount = (req, res) => {
    const r = User.count();
    res.json({ data: [{ count: r.count }], sql: r.sql, message: 'success' });
};

export const userByEmail = (req, res) => {
    const r = User.findByEmail(String(req.query.email || ''));
    res.json({ data: r.users, sql: r.sql, message: 'success' });
};

export const feedsJoin = (req, res) => {
    const r = Feed.fetchAll(100);
    const data = r.feeds.map(({ user_name, content, created_at }) => ({ user_name, content, created_at }));
    res.json({ data, sql: r.sql, message: 'success' });
};
