const log = (msg) => document.getElementById('log').innerHTML += `<p>${msg}</p>`;

// 1. ws
const wsURI = 'ws://localhost:3001';
const ws = new WebSocket(wsURI);
ws.onmessage = (e) => log(e.data);

// 2. Socket.io
const socketioURI = 'http://localhost:3002';
const socketio = io(socketioURI);

socketio.on('message', (msg) => {
    log(msg);
});

function sendAll() {
    const msg = 'テストメッセージ';
    ws.send(msg);
    socketio.send(msg);
}