import { Router } from 'express';
import * as UserController from '../controllers/UserController.js';
import * as RegisterController from '../controllers/RegisterController.js';
import * as LoginController from '../controllers/LoginController.js';
import { upload } from '../lib/util.js';

// Express Router
const router = Router();

// Routes
router.get('/user/list', UserController.apiList);
router.get('/user/:id/find', UserController.apiFind);
router.post('/user/:id/update', upload.single('avatar'), UserController.apiUpdate);

router.post('/user/login', LoginController.auth);
router.post('/user/register', RegisterController.register);

export default router;