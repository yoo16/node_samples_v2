const express = require('express');
const app = express();
const wsServer = require('./lib/ws-server');
const ioServer = require('./lib/io-server');

// 1. 静的ファイル
app.use(express.static('public'));
app.listen(3000, () => console.log('Web: http://localhost:3000'));

// 2. wsサーバー起動 (Port 3001)
wsServer(3001);

// 3. Socket.ioサーバー起動 (Port 3002)
ioServer(3002);