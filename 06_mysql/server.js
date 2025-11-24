import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

// ルーターのインポート
import routes from './routes/routes.js';
import apiRoutes from './routes/apiRoutes.js';
import sqlRoutes from './routes/sqlRoutes.js';

// 環境変数の設定
dotenv.config();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// __dirname の設定
const __dirname = path.resolve();

// Express アプリケーションの初期化
const app = express();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(express.json());
// フォームデータのパース
app.use(express.urlencoded({ extended: true }));
// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);
app.use('/api', apiRoutes);
app.use('/api', sqlRoutes);

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});