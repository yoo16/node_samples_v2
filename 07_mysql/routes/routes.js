// Express Router
import { Router } from 'express';
import { home } from '../controllers/HomeController.js';
import * as LoginController from '../controllers/LoginController.js';
import * as RegisterController from '../controllers/RegisterController.js';
import * as UserController from '../controllers/UserController.js';
import * as SQLController from '../controllers/SQLController.js';
import * as FeedController from '../controllers/FeedController.js';

// Express Router インスタンス生成 
const router = Router();

// --- ルーティング ---
router.get('/', home);
router.get('/register', RegisterController.index);
router.get('/sql-client', SQLController.index);
router.get('/login', LoginController.index);
router.get('/user/list', UserController.index);
router.get('/user/:id/edit', UserController.edit);
router.get('/feed/', FeedController.index);

export default router;