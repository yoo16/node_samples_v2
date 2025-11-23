// Express Router
import { Router } from 'express';
import { home } from '../controllers/HomeController.js';
import { index as login } from '../controllers/LoginController.js';
import { index as register } from '../controllers/RegisterController.js';
import {
    index as userList,
    edit as userEdit
} from '../controllers/UserController.js';

// Express Router インスタンス生成 
const router = Router();

// --- ルーティング ---
router.get('/', home);
router.get('/register', register);
router.get('/login', login);
router.get('/user/list', userList);
router.get('/user/:id/edit', userEdit);

export default router;