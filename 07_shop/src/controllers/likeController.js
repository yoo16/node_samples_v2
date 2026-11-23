// mock data
import { categories } from '../data/testCategories.js';
import Like from '../models/likeModel.js';

const index = (req, res) => {
    const like = Like(req.session.likes);
    const likedItems = like.getDetails();

    res.render('likes/index', {
        likedItems,
        categories
    });
};

const add = (req, res) => {
    const { productId } = req.body;

    if (!req.session.likes) {
        req.session.likes = [];
    }

    const like = Like(req.session.likes);
    like.add(productId);

    // Update session data
    req.session.likes = like.getData();

    res.redirect('/likes');
};

const remove = (req, res) => {
    const { productId } = req.body;

    if (req.session.likes) {
        const like = Like(req.session.likes);
        like.remove(productId);

        // Update session data
        req.session.likes = like.getData();
    }

    res.redirect('/likes');
};

export default {
    index,
    add,
    remove
};
