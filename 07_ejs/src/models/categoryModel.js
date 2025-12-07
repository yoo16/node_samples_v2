// mock data
import { categories } from '../data/testCategories.js';

const Category = () => {
    let items = categories || [];

    const fetchAll = () => {
        return items;
    }

    const find = (key) => {
        return items[key];
    }

    return {
        fetchAll,
        find
    };
}

export default Category;