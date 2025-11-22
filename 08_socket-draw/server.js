const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Express アプリと HTTP サーバーを作成
const app = express();
const server = http.createServer(app);

// public フォルダを静的配信
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO サーバーを作成
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("ユーザー接続:", socket.id);

    // 描画イベント
    socket.on("draw", (data) => {
        socket.broadcast.emit("draw", data);
    });

    // クリアイベント
    socket.on("clear", () => {
        io.emit("clear"); // 全員に通知
    });

    socket.on("disconnect", () => {
        console.log("ユーザー切断:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("http://localhost:3000");
});
