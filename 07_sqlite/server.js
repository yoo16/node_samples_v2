import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import { migrate } from './lib/db.js';
import routes from './routes/routes.js';

dotenv.config({ quiet: true });
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// テーブルがなければ作成
migrate();

const app = express();
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('public')));
app.use('/', routes);

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
