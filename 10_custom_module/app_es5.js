// ESMモジュール items.js からインポート
const { items } = require('./es5/items.js');
// ESMモジュール es6/shop.js を一括インポート
const shop = require('./es5/shop.js');

console.log(items);

// アイテム表示
shop.show();

// アイテム検索
shop.findById('D0002');
