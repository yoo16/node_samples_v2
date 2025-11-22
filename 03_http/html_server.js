// http モジュール読み込み
import http from "http";
// fs, path, url モジュール読み込み
import fs from "fs";
import path from "path";
import url from "url";
// child_process モジュール読み込み
import { exec } from "child_process";

const HOST = "localhost";
const PORT = 3000;

// 現在のディレクトリパス
const __dirname = path.resolve();

// 公開ディレクトリ
const publicDir = path.join(__dirname, "public");

// MIMEタイプマップ
const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
};

// ==============================
// HTTPサーバ本体
// ==============================
const server = http.createServer((req, res) => {
    // TODO: URLパース: url.parse()
    const parsed = url.parse(req.url);
    // TODO: パス名取得: pathname
    let pathname = parsed.pathname;
    // パス名ログ出力
    console.log(`pathname: ${pathname}`);

    // TODO: パスが「 / 」なら pathname = /index.html
    if (pathname === "/") pathname = "/index.html";

    // 番外編: /api/list アクセス時
    if (pathname === "/api/list") {
        execLS(res);
        return;
    }

    // アクセスファイルの絶対パス
    const filePath = path.join(publicDir, pathname);

    // ファイル存在チェック: fs.existsSync()
    if (!fs.existsSync(filePath)) {
        // TODO: 404 Not Found
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 Not Found\n");
        return;
    }

    // TODO: ファイル存在チェック
    fs.readFile(filePath, (err, data) => {
        // ファイル読み込みエラー → 500
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("500 Internal Server Error\n");
            return;
        }

        // 拡張子を取得
        const ext = path.extname(filePath).toLowerCase();
        // MIMEタイプ取得
        const mime = mimeTypes[ext] || "application/octet-stream";

        // TODO: 番外編: 動的コンテンツ処理(php, python コマンドが実行可能な場合)
        if (ext === ".php" || ext === ".py") {
            execFile(ext, filePath, res);
            return;
        }

        // TODO: 200 OK
        res.writeHead(200, { "Content-Type": mime });
        // TODO: ファイルの中身をレスポンス
        res.end(data);
    });
});

// サーバ起動
server.listen(PORT, HOST, () => {
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});

// 番外編：プログラム実行関数
function execFile(ext, filePath, res) {
    if (ext === ".php") execCommand("php", filePath, res);
    if (ext === ".py") execCommand("python", filePath, res);
}

// 番外編: ディレクトリ一覧表示関数
function execLS(res) {
    // OSによってコマンド切り替え
    const command = process.platform === "win32" ? "dir /b" : "ls -1";

    // public ディレクトリ内を一覧表示
    exec(`${command} ${publicDir}`, (err, stdout, stderr) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: stderr || err.message }));
            return;
        }

        // 出力結果を行ごとに分解 → 配列化
        const files = stdout.split(/\r?\n/).filter(Boolean);
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ files }, null, 2));
    });
    return;
}

function execCommand(command, filePath, res) {
    exec(`${command} ${filePath}`, (err, stdout, stderr) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end(stderr);
            return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(stdout);
    });
    return;
}
