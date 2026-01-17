const { WebSocketServer } = require('ws');
const crypto = require('crypto');

module.exports = (port) => {
    const wss = new WebSocketServer({ port });

    wss.on('connection', (ws) => {
        ws.id = crypto.randomUUID(); // ID生成
        console.log(`[ws] 接続: ${ws.id}`);

        ws.send(JSON.stringify({
            socketId: ws.id,
            message: "wsサーバーに接続しました",
            date: new Date().toLocaleTimeString()
        }));

        ws.on('message', (buffer) => {
            const data = JSON.stringify({
                socketId: ws.id,
                message: buffer.toString(),
                date: new Date().toLocaleTimeString()
            });
            wss.clients.forEach(client => {
                if (client.readyState === 1) client.send(data);
            });
        });

        ws.on('close', () => console.log(`[ws] 切断: ${ws.id}`));
    });

    console.log(`ws server on port ${port}`);
};