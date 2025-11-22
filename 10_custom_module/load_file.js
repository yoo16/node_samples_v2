// 1. require() で fs モジュールを読み込み
const fs = require("fs");

// ファイルパス
const filePath = "data/memo.json";

// 2. fs.readFile() でファイルを非同期読み込み
fs.readFile(filePath, "utf-8", loadMemo);

// コールバック関数
function loadMemo(err, data) {
    // 4. 読み込み完了後に実行される
    // JSON文字列 → JavaScriptオブジェクトに変換
    const memo = JSON.parse(data);

    console.log("タイトル:", memo.title);
    console.log("項目:", memo.items);
}

// 3. ファイル読み込み中のメッセージ
console.log("ファイル読み込み中...");