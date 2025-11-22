/**
 * モジュール読み込み
 */
// TODO: fsモジュール読み込む
import fs from 'fs';

// TODO: pathモジュールを読み込む
import path from 'path';

/**
 * ファイル書き出し
 */
// TODO: __dirname を定義: EMS環境では必須
const __dirname = path.resolve();

// 現在のディレクトリパスから、data/student.json を指定
const filePath = path.join(__dirname, "data", "student.json");

// 1) 書き出し開始
console.log("📖 ファイル読み込み書き込み中...");

// student オブジェクト定義
const student = {
    no: "0000001",
    name: "東京 太郎",
    createdAt: new Date().toISOString()
};

// TODO: student を JSONに変換
const json = JSON.stringify(student, null, 2);

try {
    // TODO: 2) writeFile() で非同期ファイル書き込み
    // コールバック関数: handleWrite
    fs.writeFile(filePath, json, handleWrite);
} catch (error) {
    console.error("❌ ファイル書き出しエラー:", error.message);
}

// 3) ファイル読み込み中のメッセージ
console.log("⚙️ ファイル読み込み中...");

/**
 * ファイル書き込み完了
 */
function handleWrite() {
    // 4) 書き出し完了後に実行
    console.log("✅ ファイル書き出し完了:", filePath);
}