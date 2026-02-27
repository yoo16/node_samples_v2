import express from 'express';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET;

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true
}));

// ログイン: JWTを発行し、セッションにデータを保存
app.post('/api/login', (req, res) => {
    const user = { id: 101, role: 'admin' };

    // JWT発行
    const token = jwt.sign(user, SECRET, { expiresIn: '1h' });

    // セッションに機密情報や一時データを保持
    req.session.userData = { lastLogin: new Date(), theme: 'dark' };

    res.json({ token });
});

// 認証が必要なAPI
app.get('/api/profile', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        // JWTのデータ + セッションのデータを結合して返す
        res.json({
            user,
            sessionData: req.session.userData
        });
    });
});

app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));