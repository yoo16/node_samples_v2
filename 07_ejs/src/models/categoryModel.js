// Dummy product data
import { categories } from '../data/testCategories.js';

const fetchAll = () => {
    return categories;
}

const find = (key) => {
    return categories[key];
}

export default { fetchAll, find };