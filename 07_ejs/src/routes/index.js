import express from 'express';
const router = express.Router();
import homeController from '../controllers/homeController.js';
import channelController from '../controllers/channelController.js';
import productController from '../controllers/productController.js';

router.get('/', homeController.index);
router.get('/channels', channelController.index);
router.get('/channels/:id', channelController.show);
router.get('/products', productController.index);
router.get('/products/:id', productController.show);

export default router;
