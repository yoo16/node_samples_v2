const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

// 環境変数
dotenv.config();
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
const origin = process.env.ORIGIN || "http://localhost:3000";

// Express アプリと HTTP サーバーを作成
const app = express();
const server = http.createServer(app);

// public フォルダを静的配信
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// ルームデータ
const roomData = {};

// Socket.IO サーバーを作成
const io = new Server(server, { cors: { origin } });

// 接続イベント
io.on("connection", (socket) => {
    // TODO: ルームへの参加
    socket.on("join-room", (roomName) => {
        // TODO: ルームへの参加
        socket.join(roomName);
        // TODO: 現在のルーム名を保存
        socket.currentRoom = roomName;
        console.log(`${socket.id} joined: ${roomName}`);

        if (roomData[roomName]) {
            // TODO: 履歴があれば、入室したユーザーだけに送信
            socket.emit("history", roomData[roomName]);
        } else {
            // ルームの履歴を初期化
            roomData[roomName] = [];
        }

        // TODO: 入室したユーザーだけに送信
        socket.emit("join-room", roomName);
    });

    // 特定のルームにのみ描画データを送信
    socket.on("draw", (data) => {
        // 現在のルーム名
        const room = socket.currentRoom;
        if (room) {
            // TODO: 描画データを履歴に追加
            roomData[room].push(data);
            // TODO: 特定のルームにのみ描画データを送信
            socket.to(room).emit("draw", data);
        }
    });

    // 特定のルームのみクリア
    socket.on("clear", () => {
        // 現在のルーム名
        const room = socket.currentRoom;
        if (room) {
            // TODO: ルームの履歴をリセット
            roomData[room] = [];
            // TODO: 特定のルームのみクリア
            io.to(room).emit("clear");
        }
    });
});

server.listen(port, host, () => {
    console.log(`http://${host}:${port}`);
});
