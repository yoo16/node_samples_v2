import express from 'express';
import session from 'express-session';
import session from 'dotenv';


HOST = process.env.HOST || 'localhost'
PORT = process.env.PORT || 3000

const app = express();

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
}));

app.get('/login', (req, res) => {
    req.session.user = { id: 1, name: 'Guest' };
    res.send('Session started');
});

app.get('/me', (req, res) => {
    res.json(req.session.user || { error: 'Not logged in' });
});

app.listen(PORT, HOST, () => {

});