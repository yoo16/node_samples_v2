// mock data
import Product from './productModel.js';

const Cart = (cartData) => {
    let items = cartData || [];

    // 商品を追加
    const add = (productId, quantity) => {
        const existingIndex = items.findIndex(item => item.productId === productId);
        if (existingIndex > -1) {
            items[existingIndex].quantity += quantity;
        } else {
            items.push({ productId, quantity });
        }
    };

    // 商品を削除
    const remove = (productId) => {
        items = items.filter(item => item.productId !== productId);
    };

    // 表示用に商品詳細情報を含めたリストを取得
    const getDetails = () => {
        return items.map(item => {
            const product = Product.find(item.productId);
            if (!product) return null;
            return {
                ...item,
                product,
                subtotal: product.price * item.quantity
            };
        }).filter(item => item !== null);
    };

    // 合計金額を計算
    const getTotalPrice = () => {
        const details = getDetails();
        return details.reduce((sum, item) => sum + item.subtotal, 0);
    };

    // セッション保存用に純粋な配列データを返す
    const getData = () => {
        return items;
    };

    return {
        add,
        remove,
        getDetails,
        getTotalPrice,
        getData
    };
};

export default Cart;