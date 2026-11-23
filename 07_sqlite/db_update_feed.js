import { db } from "./lib/db.js";

// 最新の feed を1件取得
const latestSQL = "SELECT id FROM feeds ORDER BY id DESC LIMIT 1";
const latest = db.prepare(latestSQL).get();

if (!latest) {
    console.log("更新する feed がありません。");
} else {
    // 更新
    const sql = "UPDATE feeds SET content = ? WHERE id = ?";
    const result = db.prepare(sql).run("更新しました", latest.id);
    console.log(`feed #${latest.id} を更新`, result);
}
db.close();
