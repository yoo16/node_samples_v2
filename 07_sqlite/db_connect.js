import { db, dbFile } from './lib/db.js';

// SQLite はファイルを開くだけ。バージョンを取得して接続確認
const sql = "SELECT sqlite_version() AS version";
const row = db.prepare(sql).get();
console.log('DB接続成功!', dbFile);
console.table(row);
db.close();
