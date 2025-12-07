// Dummy product data
import { products } from '../data/testProducts.js';

const Product = () => {
    let items = products || [];

    const latests = (limit = 3) => {
        return items.slice(0, limit);
    }

    const fetchAll = () => {
        return items;
    }

    const find = (id) => {
        return items.find(product => product.id == id);
    }

    return {
        latests,
        fetchAll,
        find
    };
}

export default Product;