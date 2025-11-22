// ESMモジュール items.js からインポート
import { items } from './es6/items.js';
// ESMモジュール es6/shop.js から個別インポート
import { show, findById } from './es6/shop.js';
// ESMモジュール es6/shop.js を一括インポート
import shop from './es6/shop.js';

console.log(items);

// 個別モジュールの場合
// show();
// findById('D0002');

// 一括モジュールの場合
shop.show();
shop.findById('D0002');