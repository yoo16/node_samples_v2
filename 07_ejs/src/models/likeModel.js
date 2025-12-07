// mock data
import Product from './productModel.js';

const Like = (likeData) => {
    let items = likeData || [];

    const add = (productId) => {
        if (!items.includes(productId)) {
            items.push(productId);
        }
    };

    const remove = (productId) => {
        items = items.filter(id => id !== productId);
    };

    const getDetails = () => {
        return items.map(id => {
            return Product().find(id);
        }).filter(item => item !== undefined);
    };

    const getData = () => {
        return items;
    };

    return {
        add,
        remove,
        getDetails,
        getData
    };
};

export default Like;
