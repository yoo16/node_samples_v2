import { WebSocketServer } from 'ws';
import crypto from 'crypto';

export default (port, origin) => {
    // WebSocketサーバー起動
    const wss = new WebSocketServer({ port, origin });

    // クライアント接続
    wss.on('connection', (ws) => {
        // WebSocketにIDを付与
        ws.id = crypto.randomUUID();

        // 接続時にメッセージ送信（システムメッセージ）
        ws.send(JSON.stringify({
            message: "wsサーバーに接続しました",
            date: new Date().toLocaleTimeString()
        }));

        // メッセージ受信
        ws.on('message', (buffer) => {
            const data = JSON.stringify({
                socketId: ws.id,
                message: buffer.toString(),
                date: new Date().toLocaleTimeString()
            });
            // 全クライアントに送信
            wss.clients.forEach(client => {
                if (client.readyState === 1) client.send(data);
            });
        });

        // 切断
        ws.on('close', () => {
            const data = JSON.stringify({
                socketId: ws.id,
                message: "wsサーバーから切断しました",
                date: new Date().toLocaleTimeString()
            });
            // 全クライアントに送信
            wss.clients.forEach(client => {
                if (client.readyState === 1) client.send(data);
            });
        });
    });
};