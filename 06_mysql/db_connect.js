import { poolRoot } from './lib/db.js';

// テスト用SQL実行関数
export async function connect() {
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

connect();