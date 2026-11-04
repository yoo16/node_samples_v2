// TODO: mysql2 モジュールインポート
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// DB接続情報を.envから取得
dotenv.config();
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD || '';

// DB接続設定
const config = {
    host,
    user,
    port,
    password,
    multipleStatements: true,
    connectionLimit: 5,
};

console.table(config);

// TODO: プール作成: createPool() で DB接続プールを作成
const pool = mysql.createPool(config);

// テスト用SQL実行関数
export async function connect() {
    try {
        // TODO: DB設定なしで非同期接続: getConnection() 
        const connection = await pool.getConnection();
        if (connection) {
            console.log('DB接続成功!');
        } else {
            console.log('DB接続失敗!');
        }
    } catch (e) {
        console.error(e);
    } finally {
        // TODO: プール切断: end()
        await pool.end();
    }
}

(async () => {
    await connect();
})();