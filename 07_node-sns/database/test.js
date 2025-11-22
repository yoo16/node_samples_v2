import { test } from '../src/lib/db.js';

const sql = 'SELECT * FROM users;';
test(sql);