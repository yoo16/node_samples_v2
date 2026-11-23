import { db } from './lib/db.js';

// ⚠️ 入力をそのまま SQL に連結すると、全件取得できてしまう
const email = "x' OR '1'='1";
const bad = `SELECT id, name, email FROM users WHERE email = '${email}'`;
console.log('[危険]', bad);
console.table(db.prepare(bad).all());

// ✅ プレースホルダなら入力は「値」としてのみ扱われる
const good = "SELECT id, name, email FROM users WHERE email = ?";
console.log('[安全]', good, [email]);
console.table(db.prepare(good).all(email));

db.close();
