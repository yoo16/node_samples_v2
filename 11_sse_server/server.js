import http from "http";
import fs from "fs";
import path from "path";
import url from "url";

// 現在のディレクトリパス
const __dirname = path.resolve();
// サーバポート
const PORT = 3000;
// ルートHTMLファイルパス
const rootFile = path.join(__dirname, "public/index.html");
// 接続中クライアントリスト
let clients = [];
// 株価ストリーミング用タイマー
let stockInterval = null;
// 現在値（初期値）
let currentPrice = 100;

// MIMEタイプマップ
const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
};

// ============================
// 共通関数
// ============================
function serveFile(res, filePath) {
    // 拡張子
    const ext = path.extname(filePath).toLowerCase();
    // コンテンツタイプ設定
    const contentType = mimeTypes[ext] || "text/plain; charset=utf-8";
    // 200 OK とコンテンツタイプを設定して返す
    res.writeHead(200, { "Content-Type": contentType });
    // Stream でファイル内容を返す
    fs.createReadStream(filePath).pipe(res);
}

// ============================
// 全クライアントにデータ配信
// ============================
function broadcast(data) {
    // console.log(data);

    // JSON文字列に変換して送信
    const json = JSON.stringify(data);
    // 全クライアントに送信
    for (const client of clients) {
        // data: メッセージ本体\n\n: メッセージ終了
        client.write(`data: ${json}\n\n`);
    }
}

// ============================
// 株価ストリーミングを開始
// ============================
function startStreaming() {
    // すでにタイマーがある場合は何もしない
    if (stockInterval) return;

    console.log("▶ Auto-start stock stream...");

    // タイマーセット
    stockInterval = setInterval(() => {
        // データ生成
        const now = new Date();

        // 前回値から ±変動（例: -0.5〜+0.5）
        const change = (Math.random() - 0.5) * 1.0;
        currentPrice = Math.max(0, currentPrice + change); // マイナス防止

        const data = {
            type: "price",
            time: now.toLocaleTimeString(),
            value: currentPrice.toFixed(2),
        };
        // 全クライアントに配信
        broadcast(data);
    }, 1000);
}

// ============================
// ルート処理
// ============================
function handleRoot(req, res) {
    // ルートパスでは HTML を返す
    serveFile(res, rootFile);
}

function handleStream(req, res) {
    console.log("📡 Client connected");

    // event-stream 用ヘッダー
    const headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    }

    // ヘッダー送信
    res.writeHead(200, headers);

    // クライアントリストに追加
    clients.push(res);

    // クライアントが来たら自動的に配信を開始
    startStreaming();

    // 切断処理
    req.on("close", () => {
        // クライアントリストから削除
        clients = clients.filter((client) => client !== res);
        console.log("❌ Client disconnected");

        // クライアントが全員離れたら自動停止
        if (clients.length === 0) {
            // タイマー停止
            clearInterval(stockInterval);
            stockInterval = null;
            console.log("🛑 No clients, stream stopped.");
        }
    });
}

// ============================
// ルーティング
// ============================
const routes = {
    "/": handleRoot,
    "/stream": handleStream,
};

// ============================
// HTTPサーバ本体
// ============================
const server = http.createServer((req, res) => {
    // URLパース
    const parsedUrl = url.parse(req.url, true);
    // パス名取得
    const pathname = parsedUrl.pathname;

    // ルーティング処理
    if (routes[pathname]) {
        routes[pathname](req, res);
    } else {
        // 静的ファイルの提供: クライアント JS や CSS用
        const filePath = path.join(__dirname, "public", pathname);
        if (fs.existsSync(filePath)) {
            serveFile(res, filePath);
        } else {
            res.writeHead(404);
            res.end("Not found");
        }
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
