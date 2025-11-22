// dotenv インポート(ESM)
import dotenv from 'dotenv';
// express インポート(ESM)
import express from 'express';

// Dotenvの設定をロード
dotenv.config();
// モデルのインポート
import { fetchProducts, findProductById, searchProducts } from './models/Product.js';

// 環境変数の取得（デフォルト値も設定）
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const BASE_URL = `http://${HOST}:${PORT}/`

console.log(BASE_URL);

// Expressアプリケーションの初期化
const app = express();

// 現在のディレクトリパスを取得
const __dirname = new URL('.', import.meta.url).pathname;

// ミドルウェア設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

let cartItems = [];

// ------------------------
// ページルーティング
// ------------------------
// GET: エンドポイント: /test
app.get('/test', (req, res) => {
    console.log("ルーティング: /test");
    const message = 'Hello, Express!';
    res.send(message);
});

// GET: エンドポイント: /test
app.get('/info', (req, res) => {
    console.log("ルーティング: /info");
    const message = 'Hello, Express!';
    res.send(message);
});

// POST: エンドポイント: /save
app.post('/save', (req, res) => {
    console.log("ルーティング: /save");
    const message = 'POST リクエストを受け取りました';
    res.send(message);
});

// GET: エンドポイント: /
app.get('/', (req, res) => {
    console.log("ルーティング: /");
    res.sendFile(__dirname + '/public/home.html');
});

// GET: エンドポイント: /search : keyword クエリパラメータ対応
app.get('/search', (req, res) => {
    console.log("ルーティング: /search");
    if (req.query.keyword) {
        const keyword = req.query.keyword;
        console.log("検索キーワード: " + keyword);
    }
    res.sendFile(__dirname + '/public/home.html');
});

// GET: エンドポイント: /about
app.get('/about', (req, res) => {
    console.log("ルーティング: /about");
    res.sendFile(__dirname + '/public/about.html');
});

// GET: エンドポイント: /product/:id
app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    console.log("ルーティング: /product/" + id);
    res.sendFile(__dirname + '/public/product.html');
});


// ------------------------
// API
// ------------------------
// GET: エンドポイント: /api/product/list
app.get('/api/product/list', (req, res) => {
    console.log("ルーティング: api/product/list");

    // 商品データを読み込む
    const products = fetchProducts();
    const data = { products }
    // 商品データを返す
    res.json(data);
});

// GET: エンドポイント: /api/product/show/:id
app.get('/api/product/show/:id', (req, res) => {
    const productId = Number(req.params.id);
    console.log(`ルーティング: /api/product/show/${productId}`);

    // 商品データを取得
    const product = findProductById(productId);
    if (!product) {
        // 商品が見つからない場合のエラーハンドリング
        return res.status(404).json({ error: "Product not found" });
    }
    // 商品データを返す
    res.json(product);
});

// GET: エンドポイント: /api/search : keyword クエリパラメータ対応
app.get('/api/search', (req, res) => {
    console.log("ルーティング: api/search");

    const keyword = req.query.keyword || '';
    console.log("検索キーワード: " + keyword);

    const products = searchProducts(keyword);
    const data = { products }
    // JSON データを返す
    res.json(data);
});

// GET: エンドポイント: /api/product/list
app.get('/api/product/list', (req, res) => {
    console.log("ルーティング: api/product/list");

    // 商品データを読み込む
    const products = fetchProducts();
    const data = { products }
    // JSON データを返す
    res.json(data);
});

app.get('/api/product/csv_download', (req, res) => {
    console.log("ルーティング: /api/product/csv_download");
    res.download(__dirname + '/data/products.csv');
});

// POST: エンドポイント: /api/cart/add/:id : id パスパラメータ対応
app.post('/api/cart/add/:id', (req, res) => {
    const id = req.params.id;
    console.log(`ルーティング: api/cart/add/${id}`);

    const product = findProductById(id);

    if (product) {
        // カートに追加
        cartItems = [...cartItems, product];
    }

    const data = { cartItems };

    // JSON データを返す
    res.json(data);
});

// ------------------------
// Express 起動
// ------------------------
app.listen(PORT, HOST, () => {
    console.log(`Server running: ${BASE_URL}`);
});