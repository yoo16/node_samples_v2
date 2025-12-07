import Cart from '../models/cartModel.js';

const index = (req, res) => {
    // new は不要。関数を実行してオブジェクトを受け取る
    const cart = Cart(req.session.cart);

    const cartItems = cart.getDetails();
    const total = cart.getTotalPrice();

    res.render('cart/index', {
        cartItems,
        total
    });
};

const add = (req, res) => {
    const { productId, quantity } = req.body;
    const qty = Number(quantity, 10) || 1;
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // カートから商品を検索
    const existingItemIndex = req.session.cart.findIndex(item => item.productId === productId);
    if (existingItemIndex > -1) {
        // カートに同じ商品が存在する場合は数量を増やす
        req.session.cart[existingItemIndex].quantity += qty;
    } else {
        // カートに同じ商品が存在しない場合は追加
        req.session.cart.push({ productId, quantity: qty });
    }

    res.redirect('/cart');
};

// カートから商品を削除
// カートから商品を削除
const remove = (req, res) => {
    const { productId } = req.body;
    if (req.session.cart) {
        // カートから商品を削除
        req.session.cart = Cart(req.session.cart).remove(productId);
    }
    res.redirect('/cart');
};

const payment = (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.redirect('/cart');
    }

    const cart = Cart(req.session.cart);
    const total = cart.getTotalPrice();

    res.render('cart/payment', {
        total
    });
};

const checkout = (req, res) => {
    // Clear the cart
    req.session.cart = [];
    res.redirect('/cart/complete');
};

const complete = (req, res) => {
    res.render('cart/complete');
};

export default {
    index,
    add,
    remove,
    payment,
    checkout,
    complete
};
