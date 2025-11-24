import { Router } from 'express';
import * as SQLController from '../controllers/SQLController.js';

// Express Router インスタンス生成 
const router = Router();

// --- データ取得 (GET: クエリパラメータを使用) ---
// 例: /api/users/list?limit=10
router.get('/users/list', SQLController.selectUsers);

// 例: /api/users/count
router.get('/users/count', SQLController.selectUserCount);

// GET /api/users/by-email (ボディ: { email: "..." })
router.get('/users/by-email', SQLController.selectUserByEmail);

// POST /api/feeds/insert (ボディ: { userId: "...", content: "..." })
router.post('/feeds/insert', SQLController.insertFeeds);

// GET /api/feeds/list
router.get('/feeds/list', SQLController.selectFeeds);

export default router;