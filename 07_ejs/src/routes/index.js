import express from 'express';
const router = express.Router();
import homeController from '../controllers/homeController.js';
import channelController from '../controllers/channelController.js';

import productController from '../controllers/productController.js';
import cartController from '../controllers/cartController.js';
import likeController from '../controllers/likeController.js';

router.get('/', homeController.index);
router.get('/channels', channelController.index);
router.get('/channels/:id', channelController.show);
router.get('/products', productController.index);
router.get('/products/:id', productController.show);

router.get('/cart', cartController.index);
router.post('/cart/add', cartController.add);
router.post('/cart/remove', cartController.remove);
router.get('/cart/payment', cartController.payment);
router.post('/cart/checkout', cartController.checkout);
router.get('/cart/complete', cartController.complete);

router.get('/likes', likeController.index);
router.post('/likes/add', likeController.add);
router.post('/likes/remove', likeController.remove);

export default router;
