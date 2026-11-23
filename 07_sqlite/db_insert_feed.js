import { db } from './lib/db.js';

// users からランダムに1件
const userSQL = "SELECT id FROM users ORDER BY RANDOM() LIMIT 1";
const user = db.prepare(userSQL).get();
if (!user) {
    console.error('ユーザーがいません。node db_import_users.js を実行してください。');
    process.exit(1);
}

// プレースホルダ (?) を使った安全な INSERT
const sql = "INSERT INTO feeds (user_id, content) VALUES (?, ?)";
const result = db.prepare(sql).run(user.id, 'こんにちは');
console.table(result);
db.close();
