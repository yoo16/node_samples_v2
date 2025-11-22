const { items } = require('./items.js');

// 全商品を表示
const show = (tax = 1.1) => {
    items.forEach((item) => {
        console.log(`${item.id}: ${item.name} - ${Math.round(item.price * tax)}円`);
    });
};

// 特定の商品を検索
const findById = (id) => {
    const selectedItem = items.find((item) => item.id === id);
    const message = selectedItem ? selectedItem : '商品が見つかりません'
    console.log(message);
};


// エクスポート
exports.show = show;
exports.findById = findById;