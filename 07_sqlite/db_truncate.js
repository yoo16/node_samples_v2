import { db } from './lib/db.js';

// SQLite に TRUNCATE はないので DELETE + AUTOINCREMENT のリセット
db.exec(`
DELETE FROM feeds;
DELETE FROM users;
DELETE FROM sqlite_sequence WHERE name IN ('feeds', 'users');
`);
console.log('✔ truncated');
db.close();
