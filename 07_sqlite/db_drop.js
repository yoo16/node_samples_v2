import fs from 'node:fs';
import { db, dbFile } from './lib/db.js';

// SQLite は DB = ファイル。閉じてから削除するだけ
db.close();
for (const f of [dbFile, `${dbFile}-wal", "${dbFile}-shm`]) {
    if (fs.existsSync(f)) fs.rmSync(f);
}
console.log('✔ dropped', dbFile);
