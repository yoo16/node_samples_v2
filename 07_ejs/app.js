import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import routes from './src/routes/index.js';
import dotenv from 'dotenv';

dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;
const siteTitle = process.env.SITE_TITLE;

const __dirname = path.resolve();

const app = express();
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    console.log(`[App] ${req.method} ${req.url}`);
    res.locals.siteTitle = siteTitle;
    next();
});

app.use(express.static('public'));
app.use('/', routes);

app.listen(port, host, () => {
    console.log(`App listening at http://${host}:${port}`);
});

export const viteNodeApp = app;
