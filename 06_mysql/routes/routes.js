// Express Router
import { Router } from 'express';
// User Model
import user from '../models/User.js';

// ビューのディレクトリパス
const viewDir = new URL('../views', import.meta.url).pathname + '/';

// Express Router インスタンス生成 
const router = Router();

// --- ルーティング ---
// GET /
router.get('/', (req, res) => {
    const path = viewDir + 'home.html';
    res.sendFile(path);
});

// GET /register
router.get('/register', (req, res) => {
    const path = viewDir + 'register.html';
    res.sendFile(path);
});

// GET /login
router.get('/login', (req, res) => {
    const path = viewDir + 'login.html';
    res.sendFile(path);
});

// POST /login
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const authUser = await user.auth(email, password);
    console.log('Authenticated User:', authUser);

    if (authUser) {
        res.redirect('/feed');
    } else {
        const path = viewDir + 'login.html';
        return res.sendFile(path);
    };
});

// GET /user/list
router.get('/user/list', (req, res) => {
    const path = viewDir + 'user/index.html';
    return res.sendFile(path);
});

// GET /user/:id/edit
router.get('/user/:id/edit', (req, res) => {
    const path = viewDir + 'user/edit.html';
    return res.sendFile(path);
});

// POST /user/:id/update
router.post('/user/:id/update', async (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;
    console.log(id, name, email);

    const result = await user.update({ id,  name, email });
    if (result) {
        res.redirect('/user/list');
    } else {
        res.redirect(`/user/${id}/edit`);
    }
});

// GET /feed
router.get('/feed', (req, res) => {
    const path = viewDir + 'feed/index.html';
    return res.sendFile(path);
});

export default router;