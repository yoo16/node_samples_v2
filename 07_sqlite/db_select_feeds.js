import { db } from './lib/db.js';

const sql = `SELECT feeds.id, users.name AS user_name, feeds.content, feeds.created_at
FROM feeds
JOIN users ON feeds.user_id = users.id
ORDER BY feeds.created_at DESC
LIMIT ?`;
console.table(db.prepare(sql).all(10));
db.close();
