import { db } from './lib/db.js';

const tablesSQL = "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'";
const tables = db.prepare(tablesSQL).all();
console.table(tables);

for (const { name } of tables) {
    const sql = `PRAGMA table_info(${name})`;
    console.log(`--- ${name} ---`);
    console.table(db.prepare(sql).all());
}
db.close();
