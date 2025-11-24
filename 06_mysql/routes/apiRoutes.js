import { Router } from 'express';
import { apiList, apiFind, apiUpdate } from '../controllers/UserController.js';
import { register } from '../controllers/RegisterController.js';
import { login } from '../controllers/LoginController.js';
import { registerValidationRules, validate } from '../middlewares/validator.js';
import { upload } from '../lib/util.js';

// Express Router
const router = Router();

// Routes
router.get('/user/list', apiList);
router.get('/user/:id/find', apiFind);
router.post('/user/:id/update', upload.single('avatar'), apiUpdate);

router.post('/user/login', login);
router.post('/user/register', registerValidationRules, validate, register);

export default router;