import { Router } from 'express';
import UserModel from '../models/User.js';
import feedModel from '../models/Feed.js';

// Express Router
const router = Router();

// GET /api/user/list
router.get('/user/list', async (req, res) => {
    const users = await UserModel.fetchAll();
    const result = { users };
    res.json(result);
});

// GET /api/user/:id/find
router.get('/user/:id/find', async (req, res) => {
    const id = req.params.id;
    const user = await UserModel.find(id);
    const result = { user };
    res.json(result);
});

// POST /api/feed/:id/like
router.post('/feed/:id/like', async (req, res) => {
    console.log("Like API called");
    const user = req.session.user;
    console.log(user);
    const feedId = req.params.id;
    console.log(feedId);

    const result = await feedModel.toggleLike(feedId, user.id);
    res.json(result);
});

export default router;