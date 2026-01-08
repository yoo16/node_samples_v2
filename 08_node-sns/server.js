import express from 'express';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';
import layouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import { restoreUser } from './src/middlewares/authenticateRequest.js';
// --- ルーティングファイル インポート ---
import authRoutes from './src/routes/authRoutes.js';
import registerRoutes from './src/routes/registerRoutes.js';
import feedRoutes from './src/routes/feedRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import apiRoutes from './src/routes/apiRoutes.js';

// ---- Env ----
dotenv.config();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// ---- Path ----
const __dirname = path.resolve();

// ---- Express ----
const app = express();

// ---- public フォルダのWeb公開 ----
app.use(express.static(path.join(__dirname, 'public')));

// ---- URLエンコーディング ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- JWT Cookie読み込み ---
app.use(cookieParser());

// ---- セッション ----
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    // Cookie 設定
    // httpOnly: true で XSS 攻撃を防ぐ
    // sameSite: "lax" で CSRF 攻撃を防ぐ
    // secure: true で HTTPS で通信する
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// ---- 認証用（セッション＆JWT） ----
app.use(restoreUser);

// ---- View Engine ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---- レイアウト ----
// views/layouts/default.ejs
app.set('layout', 'layouts/default');
app.use(layouts);


// ---- ルーティング ----
app.use('/', authRoutes);
app.use('/register', registerRoutes);
app.use('/feed', feedRoutes);
app.use('/user', userRoutes);
app.use('/api', apiRoutes);

// ---- サーバ起動 ----
app.listen(port, host, () => {
    console.log(`Server running → http://${host}:${port}`);
});