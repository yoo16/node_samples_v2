const { Server } = require('socket.io');

module.exports = (port) => {
    // CORS Origin 指定
    const origin = "http://localhost:3000";

    // サーバー起動
    const io = new Server(port, { cors: { origin } });

    io.on('connection', (socket) => {
        console.log(`[Socket.io] 接続: ${socket.id}`);

        io.emit('connected', {
            socketId: socket.id,
            message: "Socket.ioサーバーに接続しました",
            date: new Date().toLocaleTimeString()
        });

        socket.on('message', (msg) => {
            io.emit('message', {
                socketId: socket.id,
                message: msg,
                date: new Date().toLocaleTimeString()
            });
        });

        socket.on('disconnect', () => {
            io.emit('message', {
                socketId: socket.id,
                message: '退出しました',
                date: new Date().toLocaleTimeString()
            });
        });
    });

    console.log(`Socket.io server on port ${port}`);
};