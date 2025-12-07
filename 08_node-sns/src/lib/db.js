import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// DB接続情報を.envから取得
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_DATABASE;

if (!host || !port || !user) {
    console.error('.env でデータベース設定をしてください。');
    // プロセス終了
    process.exit(1);
}

// 接続設定
const config = {
    host,
    user,
    port,
    password,
    database,
    multipleStatements: true,
    connectionLimit: 5,
};
console.table(config)

// 接続設定(database 指定なし)
const configRoot = {
    host,
    user,
    port,
    password,
    multipleStatements: true,
};

// プール作成
export const pool = mysql.createPool(config);

// プール作成(database 指定なし)
export const poolRoot = mysql.createPool(configRoot);


export const query = async (sql, params) => {
    const [rows] = await pool.query(sql, params);
    return rows;
}

export async function connectTest() {
    try {
        // DB設定なしで接続
        const connection = await pool.getConnection();
        console.log('DB接続成功!', config.database);
        connection.release();
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

export async function connectTestRoot() {
    try {
        // DB設定なしで接続
        const connection = await poolRoot.getConnection();
        console.log('DB接続成功!');
        connection.release();
    } catch (e) {
        console.error(e);
    } finally {
        await poolRoot.end();
    }
}
