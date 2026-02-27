const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const tables = {};

// --- ヘルパー関数 (スコープの外に定義) ---

function createDeck() {
    const types = ['m', 'p', 's'];
    let deck = [];
    types.forEach(t => {
        for (let i = 1; i <= 9; i++) {
            for (let j = 0; j < 4; j++) deck.push(i + t);
        }
    });
    for (let i = 1; i <= 7; i++) {
        for (let j = 0; j < 4; j++) deck.push(i + 'z');
    }
    return deck.sort(() => Math.random() - 0.5);
}

function drawTile(roomId) {
    const table = tables[roomId];
    const nextPlayer = table.players[table.turn];

    if (table.deck.length > 0) {
        const newTile = table.deck.pop();
        nextPlayer.hand.push(newTile);

        io.to(nextPlayer.id).emit("deal_hand", nextPlayer.hand);
        io.to(roomId).emit("update_turn", {
            turnPlayerId: nextPlayer.id,
            remainingDeck: table.deck.length
        });
    } else {
        io.to(roomId).emit("game_over", "流局");
    }
}

// --- Socket.io メインロジック ---

io.on("connection", (socket) => {
    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        socket.roomId = roomId;

        if (!tables[roomId]) {
            tables[roomId] = {
                players: [],
                deck: createDeck(),
                status: "waiting",
                turn: 0,       // 手番初期化
                discards: []   // 河の初期化
            };
        }

        const table = tables[roomId];
        if (table.status === "playing") return;

        if (!table.players.find(p => p.id === socket.id)) {
            table.players.push({ id: socket.id, hand: [] });
        }

        io.to(roomId).emit("update_players", table.players.length);

        if (table.players.length === 4) {
            table.status = "playing";

            // クライアントが座順を把握できるようにプレイヤーリストを送る
            io.to(roomId).emit("game_started", {
                players: table.players.map(p => ({ id: p.id }))
            });

            table.players.forEach(p => {
                p.hand = table.deck.splice(0, 13);
                io.to(p.id).emit("deal_hand", p.hand);
            });
            drawTile(roomId);
        }
    });

    socket.on("discard_tile", (data) => {
        const roomId = socket.roomId;
        const table = tables[roomId];
        if (!table || table.status !== "playing") return;

        console.log("discard_tile", data);
        const { tile } = data;
        const currentPlayer = table.players[table.turn];

        if (socket.id !== currentPlayer.id) return;

        const index = currentPlayer.hand.indexOf(tile);
        if (index > -1) {
            currentPlayer.hand.splice(index, 1);
            table.discards.push({ playerId: socket.id, tile: tile });

            io.to(roomId).emit("tile_discarded", {
                playerId: socket.id,
                tile: tile,
                discards: table.discards,
                remainingDeck: table.deck.length
            });

            // 次のプレイヤーへ
            table.turn = (table.turn + 1) % 4;
            drawTile(roomId);
        }
    });

    socket.on("disconnect", () => {
        const roomId = socket.roomId;
        if (roomId && tables[roomId]) {
            const table = tables[roomId];
            table.players = table.players.filter(p => p.id !== socket.id);
            if (table.players.length === 0) {
                delete tables[roomId];
            } else {
                if (table.status === "playing") {
                    table.status = "waiting";
                    io.to(roomId).emit("game_interrupted", "中断されました");
                }
                io.to(roomId).emit("update_players", table.players.length);
            }
        }
    });
});

server.listen(3000, () => console.log("Mahjong Server: http://localhost:3000"));