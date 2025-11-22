// express インポート
const express = require('express');
// dotenv インポート
const dotenv = require('dotenv');
// Dotenvの設定をロード
dotenv.config();
// session インポート
const session = require('express-session');
// Userモデルのインポート
const user = require('./models/User');

// 環境変数の取得（デフォルト値も設定）
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'defaultSecretKey';

// Expressアプリケーションの初期化
const app = express();

/**
 * ミドルウェア設定
 **/
// URLエンコードされたデータのパース
app.use(express.urlencoded({ extended: true }));
// 静的ファイルの提供: public フォルダ
app.use(express.static(__dirname + '/public'));
// セッション設定
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,                // 変更がない限り保存しない
        saveUninitialized: false,     // 未初期化セッションを保存しない
        cookie: { maxAge: 1000 * 60 * 60 } // 60分有効
    })
);

/**
 * ルーティング設定
 */
// (GET) /test : テスト用ルート
app.get('/test', (req, res) => {
    const message = "Hello, Express!";
    res.send(message);
});

// (GET) /search : 検索キーワード
app.get('/search', (req, res) => {
    // GETパラメータ取得: ?keyword=xxxx
    const keyword = req.query.keyword || '';
    // レスポンス送信
    res.send(keyword);
});

// (GET) / : トップページ
app.get('/', (req, res) => {
    // パスの設定
    const path = __dirname + '/public/index.html';
    // ファイル送信
    res.sendFile(path);
});

// (GET) /mypage : ユーザマイページ
app.get('/mypage', (req, res) => {
    // パスの設定: public/mypage/index.html
    const path = __dirname + '/public/mypage/index.html';
    // ファイル送信
    res.sendFile(path);
});

// (GET) /regist/ : ユーザ登録ページ
app.get('/regist/', (req, res) => {
    // パスの設定: public/regist.html
    const path = __dirname + '/public/regist.html';
    // ファイル送信
    res.sendFile(path);
});

// (GET) /login : ログインページ
app.get('/login', (req, res) => {
    // パスの設定: public/login.html
    const path = __dirname + '/public/login.html';
    // ファイル送信
    res.sendFile(path);
});

// (GET) /logout : ログインページ
app.get('/logout', (req, res) => {
    res.redirect('/login/');
});

// (POST) /regist/add : ユーザ登録処理
app.post('/regist/add', (req, res) => {
    // POST データ取得
    const data = req.body;
    console.log(data);

    // Userモデル利用：既存ユーザ確認: findByEmail
    const existUser = user.findByEmail(data.email);
    if (existUser) {
        // 既存ユーザあり：リダイレクト -> /regist/
        res.redirect('/regist/');
        return;
    }

    // ファイル書き込み
    const newUser = user.save(data);
    if (newUser.id) {
        // ユーザあり：リダイレクト -> /login/
        res.redirect('/login/');
        return;
    } else {
        // ユーザなし：リダイレクト -> /regist/
        res.redirect('/regist/');
        return;
    }
});

// (POST) /auth : ログイン認証処理
app.post('/login/auth', (req, res) => {
    // POST データ取得
    const data = req.body;
    console.log(data);

    // ユーザ認証
    const authUser = user.auth(data.email, data.password);
    if (!authUser) {
        // 認証失敗: リダイレクト -> /login/
        res.redirect('/login/');
        return;
    }

    // 認証成功
    // ハッシュパスワードは残さない
    delete (authUser.password);
    // user セッション保存
    req.session.user = authUser;
    // マイページへリダイレクト -> /mypage/
    res.redirect('/mypage/');
});

// (GET) /api/user : ユーザ情報API
app.get('/api/user', (req, res) => {
    // セッションからユーザ情報取得: req.session.user
    const authUser = req.session.user;
    console.log('Session User:', authUser);
    if (!authUser) {
        // 未認証: 401 エラー
        res.status(401).send({ error: 'Unauthorized' });
        return;
    }
    const data = {
        user: authUser
    };
    res.json(data);
});

// Expressサーバー起動＆監視
app.listen(PORT, HOST, () => {
    console.log(`Server running: http://${HOST}:${PORT}/`);
});