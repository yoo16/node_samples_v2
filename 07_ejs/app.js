import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import routes from './src/routes/index.js';
import dotenv from 'dotenv';
import session from 'express-session';

// dotenv から環境変数を読み込む
dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;

const secretKey = process.env.SECRET_KEY;
const siteTitle = process.env.SITE_TITLE;

// 現在のディレクトリを取得
const __dirname = path.resolve();

// Express アプリケーションを初期化
const app = express();

// レイアウトを有効にする
app.use(expressLayouts);
app.set('layout', 'layout');

// EJS を使用する
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静的コンテンツの公開
app.use(express.static('public'));
// URLエンコードされたデータの解析
app.use(express.urlencoded({ extended: true }));

// セッションの設定
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// ミドルウェア
app.use((req, res, next) => {
    // サイトタイトルをビューに渡す
    res.locals.siteTitle = siteTitle;
    // セッションをビューに渡す
    res.locals.session = req.session;

    // カート内の全アイテムの quantity を合計する
    const cart = req.session.cart || [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    res.locals.cartCount = cartCount;

    next();
});

app.use('/', routes);

app.listen(port, host, () => {
    console.log(`App listening at http://${host}:${port}`);
});

export const viteNodeApp = app;
