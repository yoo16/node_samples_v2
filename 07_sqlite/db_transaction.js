import { db } from './lib/db.js';

// BEGIN → 複数の SQL → COMMIT。失敗したら ROLLBACK
function insertFeedTransaction({ fail = false } = {}) {
    db.exec('BEGIN');
    console.log('--- トランザクション開始 ---');
    try {
        const userSQL = "SELECT id FROM users ORDER BY RANDOM() LIMIT 1";
        const user = db.prepare(userSQL).get();
        if (!user) throw new Error('ユーザーが見つかりませんでした。');

        const feedSQL = "INSERT INTO feeds (user_id, content) VALUES (?, ?)";
        db.prepare(feedSQL).run(user.id, 'トランザクション1');
        if (fail) throw new Error('わざと失敗させました。');
        db.prepare(feedSQL).run(user.id, 'トランザクション2');

        db.exec('COMMIT');
        console.log('--- COMMIT しました ---');
    } catch (e) {
        db.exec('ROLLBACK');
        console.error(e.message);
        console.log('--- ROLLBACK しました ---');
    }
}

const count = () => {
    const sql = "SELECT COUNT(*) AS n FROM feeds";
    return db.prepare(sql).get().n;
};

console.log('feeds:', count());
insertFeedTransaction();               // 成功: +2件
console.log('feeds:', count());
insertFeedTransaction({ fail: true }); // 失敗: 増えない
console.log('feeds:', count());
db.close();
