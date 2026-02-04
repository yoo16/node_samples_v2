import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

let clients = [];
let currentPrice = 100;
let stockInterval = null;

// 静的ファイルの提供 (publicフォルダ内の index.html 等)
app.use(express.static(path.join(__dirname, "public")));

// SSE エンドポイント
app.get("/stream", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });

    clients.push(res);

    startStreaming();

    req.on("close", () => {
        clients = clients.filter(client => client !== res);
        if (clients.length === 0) {
            clearInterval(stockInterval);
            stockInterval = null;
        }
    });
});

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});

// ストリーミングロジック
const startStreaming = () => {
    if (stockInterval) return;
    stockInterval = setInterval(() => {
        currentPrice = Math.max(0, currentPrice + (Math.random() - 0.5));
        const data = {
            type: "price",
            time: new Date().toLocaleTimeString(),
            value: currentPrice.toFixed(2),
        };
        const json = JSON.stringify(data);
        clients.forEach(res => res.write(`data: ${json}\n\n`));
    }, 1000);
};