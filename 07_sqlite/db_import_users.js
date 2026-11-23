import { faker } from '@faker-js/faker';
import { db, migrate } from './lib/db.js';

migrate();

const USERS = 10;
const FEEDS = 30;

const userSQL = "INSERT INTO users (name, email) VALUES (?, ?)";
const feedSQL = "INSERT INTO feeds (user_id, content, created_at) VALUES (?, ?, ?)";
const insertUser = db.prepare(userSQL);
const insertFeed = db.prepare(feedSQL);

// まとめて投入するのでトランザクションを使う (速く、途中失敗時は全部戻る)
db.exec('BEGIN');
try {
    for (let i = 1; i <= USERS; i++) {
        insertUser.run(faker.person.fullName(), `user${i}@test.com`);
    }
    for (let i = 0; i < FEEDS; i++) {
        const createdAt = faker.date.recent({ days: 14 }).toISOString().replace('T', ' ').slice(0, 19);
        insertFeed.run(faker.number.int({ min: 1, max: USERS }), faker.lorem.sentence(), createdAt);
    }
    db.exec('COMMIT');
    console.log(`✔ ${USERS} users / ${FEEDS} feeds imported!`);
} catch (e) {
    db.exec('ROLLBACK');
    console.error('❌ Import error:', e.message);
}
db.close();
