import express from 'express';
import wsServer from './lib/ws-server.js';
import ioServer from './lib/socketio-server.js';
import dotenv from 'dotenv';

// .envを読み込む
dotenv.config();

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;
const SOCKETIO_PORT = process.env.SOCKETIO_PORT || 3002;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// Express
const app = express();

// 1. 静的ファイル
app.use(express.static('public'));
// 2. HTTPサーバー起動 (Port 3000)
app.listen(PORT, () => console.log(`Web: http://${HOST}:${PORT}`));

// 3. wsサーバー起動 (Port 3001)
wsServer(WS_PORT, CORS_ORIGIN);

// 4. Socket.ioサーバー起動 (Port 3002)
ioServer(SOCKETIO_PORT, CORS_ORIGIN);