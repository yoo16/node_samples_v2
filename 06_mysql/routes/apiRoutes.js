import { Router } from 'express';
import { uploadAvatar } from '../middlewares/upload.js';
import { list, find, update, login } from '../controllers/UserController.js';

// Express Router
const router = Router();

router.get('/user/list', list);
router.get('/user/:id/find', find);
router.post('/user/:id/update', update);
router.post('/login', login);

export default router;