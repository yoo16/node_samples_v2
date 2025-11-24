import { pool } from './lib/db.js';
import * as userModel from './models/User.js';

const users = await userModel.fetchAll(3);
console.log(users);

pool.end();