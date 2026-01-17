// Express の初期化
const express = require('express')
const app = express()
const http = require('http').createServer(app)

// UUID 生成用
const uuidv4 = require('uuid').v4

// Socket.IO の初期化
const io = require('socket.io')(http, {
    // 10MB まで許可（デフォルトは 1MB）
    maxHttpBufferSize: 10e6
});

const dotenv = require('dotenv');
dotenv.config();
const host = process.env.HOST
const port = process.env.PORT

// ユーザ情報保存用
let users = {};

// ejs を view engine に設定
app.use(express.static(__dirname + '/public'))

// view engine に ejs を設定
app.get('/', (req, res) => {
    res.render('index.ejs')
})

// ログアウト処理
logout = (socket) => {
    console.log('logout');

    // ユーザ情報取得
    if (!users) return;
    let user = users[socket.id];
    if (!user) return;

    //ユーザ削除
    delete users[socket.id];

    // 送信元以外全てのクライアントに送信
    socket.broadcast.emit('user_left', {
        username: user.name,
        users: users,
    });
}

// ユーザ情報取得
fetchUser = (socket) => {
    if (!users) return;
    return users[socket.id];
}

//connection イベント 
io.on('connection', (socket) => {
    // client から server のメッセージ
    socket.on('message', (data) => {
        data.datetime = Date.now();
        // server から client へのメッセージ
        io.emit('message', data);
    })

    //ログイン処理
    socket.on('auth', (user) => {
        //トークンがあれば処理しない
        if (user.token) return;

        //トークン発行
        user.token = uuidv4();

        //Socket ID をキーに user を配列に追加
        users[socket.id] = user;

        //data の作成
        let data = { user: user, users: users };
        console.log(user);

        //送信元の「logined」に emit()
        socket.emit('logined', data);

        //ブロードキャストで「user_joined」に emit()
        socket.broadcast.emit('user_joined', data);
    });

    //スタンプ送受信
    socket.on('upload_stamp', (data) => {
        console.log('upload_stamp');
        data.datetime = Date.now();
        io.emit('upload_stamp', data);
    });

    //画像送受信
    socket.on('upload_image', (data) => {
        console.log('upload_image');
        data.datetime = Date.now();
        io.emit('upload_image', data);
    });

    //ログアウト
    socket.on('logout', () => {
        logout(socket);
    });

    socket.on('disconnect', () => {
        logout(socket);
    });

})

http.listen(port, host, () => {
    console.log(`listening on http://${host}:${port}`)
})