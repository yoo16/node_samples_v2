// Dummy product data
import { products } from '../data/testProducts.js';

const latests = () => {
    return products.slice(0, 4);
}

const fetchAll = () => {
    return products;
}

const find = (id) => {
    return products.find(product => product.id == id);
}

export default { fetchAll, find, latests };