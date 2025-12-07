import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

const index = (req, res) => {
    const products = Product().fetchAll();
    const categories = Category().fetchAll();
    res.render('product/index', {
        products,
        categories,
    });
};

const show = (req, res) => {
    const id = req.params.id;
    const product = Product().find(id);
    const categories = Category().fetchAll();
    res.render('product/show', {
        product,
        categories,
    });
};

export default {
    index,
    show,
};
