import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

export default (port, origin) => {
    // Socket.io サーバー起動
    const io = new Server(port, { cors: { origin } });

    // クライアント接続
    io.on('connection', (socket) => {
        console.log(`[Socket.io] 接続: ${socket.id}`);
        let data = {}
        const dateString = new Date().toLocaleTimeString()

        data = {
            message: `接続しました`,
            date: dateString
        }
        // TODO: 本人に接続時にメッセージ送信
        // イベント名: connected
        socket.emit('connected', data);

        // 接続時にメッセージ送信
        data = {
            message: `${socket.id} が接続しました`,
            date: dateString
        }
        // TODO: ブロードキャストで接続メッセージを送信
        // イベント名: joined
        socket.broadcast.emit('joined', data);

        // メッセージ受信
        socket.on('message', (msg) => {
            data = {
                socketId: socket.id,
                message: msg,
                date: new Date().toLocaleTimeString()
            }
            // TODO: 全クライアントに送信: 
            // io.emit() または socket.broadcast.emit()
            // イベント名: message
            io.emit('message', data);
        });

        // 切断
        socket.on('disconnect', () => {
            data = {
                message: `${socket.id} が退出しました`,
                date: new Date().toLocaleTimeString()
            }
            // TODO: 全クライアントに送信: イベント名: message
            io.emit('message', data);
        });
    });
};