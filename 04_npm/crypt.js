// カスタム暗号化モジュールのインポート: ./utils/cryptoUtil.js
// メソッド: encrypt, decrypt, generateKey
const { encrypt, decrypt, generateKey } = require('./utils/cryptoUtil');

// 鍵（32文字＝256bit）、初期化ベクトル（16文字＝128bit）
const message = "Hello";
const key = generateKey("mySecretKey");
const encrypted = encrypt(message, key);
const decrypted = decrypt(encrypted, key);

// 結果表示
let result = { message, encrypted, decrypted };
console.table(result);