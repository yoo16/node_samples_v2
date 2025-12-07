import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import Channel from '../models/channelModel.js';

const index = (req, res) => {
    const latestProducts = Product.latests();
    const latestChannels = Channel.latests();
    const categories = Category.fetchAll();
    res.render('home/index', {
        latestProducts,
        latestChannels,
        categories,
    });
};

export default {
    index
};
