import { db, migrate, dbFile } from './lib/db.js';

migrate();
console.log('✔ DB create completed!', dbFile);
db.close();
