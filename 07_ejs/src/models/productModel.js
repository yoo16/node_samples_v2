// Dummy product data
import { products } from '../data/testProducts.js';

const latests = (limit = 3) => {
    return products.slice(0, limit);
}

const fetchAll = () => {
    return products;
}

const find = (id) => {
    return products.find(product => product.id == id);
}

export default { fetchAll, find, latests };