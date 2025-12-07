import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import layouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import { auth } from './src/middlewares/auth.js';
import authRoutes from './src/routes/authRoutes.js';
import registerRoutes from './src/routes/registerRoutes.js';
import feedRoutes from './src/routes/feedRoutes.js';
import apiRoutes from './src/routes/apiRoutes.js';

// ---- Env ----
dotenv.config();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// ---- Path ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Express ----
const app = express();

// ---- Required middleware ----
// JWT Cookie読み込み
app.use(cookieParser());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// JWT → Session 復元 ＆ authUser を res.locals へ反映
app.use(auth);

// ---- View Engine ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/default');
app.use(layouts);

// ---- Request Parser ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Static ----
app.use(express.static(path.join(__dirname, 'public')));

// ---- Routes ----
app.use('/', authRoutes);
app.use('/', registerRoutes);
app.use('/', feedRoutes);
app.use('/api', apiRoutes);

// ---- Server Start ----
app.listen(port, host, () => {
    console.log(`Server running → http://${host}:${port}`);
});