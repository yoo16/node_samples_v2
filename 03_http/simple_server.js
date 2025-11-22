// httpモジュールをインポート
import http from "http";

// HTTPサーバ作成
const server = http.createServer((req, res) => {
    // TODO: ヘッダー
    res.writeHead(200, { "Content-Type": "text/text; charset=utf-8" });

    // データ作成
    const data = {
        message: "Hello, Node Server!",
        time: new Date().toISOString(),
    }
    // JSONに変換
    const json = JSON.stringify(data, null, 2);

    // TODO: JSONレスポンス
    res.write(json);

    // TODO: レスポンス終了
    res.end();
});

// TODO: サーバホスト: localhost
const HOST = "localhost";
// TODO: サーバポート: 3000
const PORT = 3000;

// TODO: サーバ起動
server.listen(PORT, HOST, () => {
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});

// ターミナル： node server.js で起動
// サーバ停止： Ctrl + C