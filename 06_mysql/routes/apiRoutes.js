import { Router } from 'express';
import {
    fetchAll as fetchAllUser,
    find as findUser,
    update as updateUser,
} from '../controllers/UserController.js';
import { register } from '../controllers/RegisterController.js';
import { login } from '../controllers/LoginController.js';
import { registerValidationRules, validate } from '../middlewares/validator.js';
// Express Router
const router = Router();

// Routes
router.get('/user/list', fetchAllUser);
router.get('/user/:id/find', findUser);
router.post('/user/:id/update', updateUser);
router.post('/user/login', login);
router.post('/user/register', registerValidationRules, validate, register);

export default router;