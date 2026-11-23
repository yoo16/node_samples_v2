import { db } from './lib/db.js';

// 使い方: node db_query.js "SELECT * FROM users LIMIT 3"
const sql = process.argv[2] || 'SELECT * FROM users LIMIT 5';
console.log(sql);
try {
    console.table(db.prepare(sql).all());
} catch (e) {
    console.error(e.message);
}
db.close();
