import { Router } from 'express';
import { page } from '../controllers/PageController.js';
import * as Api from '../controllers/ApiController.js';

const router = Router();

// Pages
router.get('/', page('home'));
router.get('/feeds', page('feeds'));
router.get('/users', page('users'));
router.get('/sql-client', page('sql_client'));

// API
router.get('/api/users', Api.userList);
router.get('/api/users/count', Api.usersCount);
router.get('/api/users/by-email', Api.userByEmail);
router.get('/api/feeds', Api.feedList);
router.get('/api/feeds/join', Api.feedsJoin);
router.post('/api/feeds', Api.feedPost);
router.post('/api/feeds/injection', Api.feedPostInjection);
router.post('/api/feeds/:id/destroy', Api.feedDestroy);

export default router;
