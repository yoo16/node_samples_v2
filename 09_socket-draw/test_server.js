const { WebSocketServer } = require('ws');
const { Server } = require('socket.io');

// --- 1. ws (Port 3001) ---
const wss = new WebSocketServer({ port: 3001 });
wss.on('connection', (ws) => {
    console.log('[ws] クライアント接続');
    ws.on('message', (msg) => ws.send(`ws返信: ${msg}`));
});

// --- 2. Socket.io (Port 3002) ---
const io = new Server(3002, { cors: { origin: "*" } });
io.on('connection', (socket) => {
    console.log('[Socket.io] クライアント接続');
    socket.on('message', (msg) => socket.send(`Socket.io返信: ${msg}`));
});