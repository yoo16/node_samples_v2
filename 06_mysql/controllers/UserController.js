import { pool } from '../lib/db.js';
import bcrypt from 'bcrypt';

export const list = async (req, res) => {
    // SQL 文
    const sql = `SELECT * FROM users LIMIT ?;`;
    const limit = 20;
    // SQL 実行
    const [users] = await pool.query(sql, [limit]);
    // 結果返却 JSON
    const result = {
        users,
        sql: pool.format(sql, [limit]),
        endpoint: req.url
    };
    res.json(result);
}

export const find = async (req, res) => {
    const endpoint = '/user/:id/find';
    const id = req.params.id;
    const sql = `SELECT * FROM users WHERE id = ?;`;
    const [user] = await pool.query(sql, [id]);
    const result = {
        user,
        sql: pool.format(sql, [id]),
        endpoint
    };
    res.json(result);
}

export const update = async (req, res) => {
    const { user_id, name, email } = req.body;

    // avatar
    const avatar = req.file ? req.file.filename : null;
    let avatar_url = null;
    // avatar upload
    if (avatar) {
        const ext = path.extname(avatar);
        avatar_url = `/images/users/${user_id}.${ext}`;
        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, 'public/images/users');
            },
            filename: function (req, file, callback) {
                callback(null, `${user_id}${ext}`);
            },
        });
    }


    const endpoint = '/user/:id/update';
    // ID 取得
    const id = req.params.id;
    // SQL 文
    const sql = `UPDATE users 
                SET name = ?, email = ?, avatar_url = ? 
                WHERE id = ?`;
    // SQL 実行
    const [rows] = await pool.query(sql, [name, email, avatar_url, id]);
    const user = rows[0];

    // 結果返却 JSON
    const result = {
        user,
        sql: pool.format(sql, [name, email, avatar_url, id]),
        endpoint: req.url
    };
    res.json(result);
}

export const login = async (req, res) => {
    // リクエストデータ取得
    const { email, password } = req.body;
    // SQL 文
    const sql = 'SELECT * FROM users WHERE email = ?';
    // SQL 実行
    const [rows] = await pool.query(sql, [email]);
    // ユーザー存在チェック
    const existUser = rows.length > 0 ? rows[0] : null;
    // パスワード照合
    const isMatch = await bcrypt.compare(password, existUser.password);
    // 結果返却 JSON
    const result = {
        authUser: isMatch ? existUser : null,
        sql: pool.format(sql, [email]),
        endpoint: req.url
    };
    res.json(result);
}