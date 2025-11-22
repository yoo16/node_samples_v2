// ターミナルで事前にインストール
// npm i uuid

// TODO: UUID インポート
// const uuid = require('uuid');
// const id = uuid.v4();

// TODO: UUID生成（エイリアス）: v4
const { v4: uuidv4 } = require('uuid');

const id = uuidv4();
const name = "Alice";
const email = "alice@test.com";

const user = { id, name, email };
console.table(user);