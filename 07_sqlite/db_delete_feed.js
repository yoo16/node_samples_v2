import { db } from './lib/db.js';

// 最新の feed を1件取得
const latestSQL = "SELECT id FROM feeds ORDER BY id DESC LIMIT 1";
const latest = db.prepare(latestSQL).get();

if (!latest) {
    console.log('削除する feed がありません。');
} else {
    // 削除
    const sql = "DELETE FROM feeds WHERE id = ?";
    const result = db.prepare(sql).run(latest.id);
    console.log(`feed #${latest.id} を削除`, result);
}
db.close();
